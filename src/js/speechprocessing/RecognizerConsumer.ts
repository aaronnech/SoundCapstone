/**
 * RecognizerConsumer is a consumer that recognizes hypothesis based on a model.
 */
class RecognizerConsumer {
    private worker : Worker;
    private callbackIndex : number;
    private loadSequence : Function[];
    private stopped : boolean;

    private words : any;
    private grammar : any;
    private hypotheses : any[];

    constructor(worker : Worker) {
        this.worker = worker;
        this.worker.onmessage = (e) => {
            this.onWorkerMessage(e);
        }

        // Prevents advancement of processing by worker thread once audio recording has been terminated
        this.stopped = false;
        this.hypotheses = [];

        // TODO: make this class take as input to the constructor model, words and grammar to recognize
        // TODO: recompile pocketsphinx with the phoneme model
        this.words = [["GREEN", "G R IY N"], ["GWEEN", "G W IY N"]];
        this.grammar = {numStates: 1, start: 0, end: 0, transitions: [{from: 0, to: 0, word: "GWEEN"}, {from: 0, to: 0, word: "GREEN"}]};
    }

    /**
     * Initializes the worker, relies on the worker-message rely to
     * simulate callbacks tracked by this class state.
     * @param callback The function to be notified when ready
     */
    public initWorkerData(callback : Function) : void {
        this.worker.postMessage({'command' : 'initialize'});
        // Will execute these callbacks in sequence when worker responds to main UI thread after media loading.
        this.loadSequence = [this.loadWords, this.loadGrammar, callback];
        this.callbackIndex = 0;
        this.stopped = false;
    }

    /**
     * Loads the words to recognize
     */
    private loadWords() : void {
        this.postMessage({'command' : 'addWords', 'data' : this.words});
    }

    /**
     * Loads the grammar to recognize
     */
    private loadGrammar() : void {
        this.postMessage({'command' : 'addGrammar', 'data' : this.grammar});
    }

    /**
     * Get the hypotheses stored by this recognizer consumer
     * @returns The hypotheses stored.
     */
    public getHypotheses() : any[] {
        return this.hypotheses;
    }

    /**
     * Callback to deal with worker messages back to the main thread
     * @param e The message sent to the main thread
     */
    private onWorkerMessage(e : any) : void {
        if (!this.stopped) {
            console.log('FROM RecognizerConsumer: ');
            console.log(e);
            // Recognizer wants to notify us that particular task has a status.
            // This is the load sequence
            if (e.data.hasOwnProperty('id') && this.callbackIndex < this.loadSequence.length) {
                this.loadSequence[this.callbackIndex++].apply(this, []);
            }

            // Recognizer has a new hypothesis
            if (e.data.hasOwnProperty('hyp')) {
                this.hypotheses.push(e.data);
            }
        }
    }

    /**
     * Called by web worker message postings via ducktyping
     * @param e The message posted to the worker
     */
    public postMessage(e : any) : void {
        console.log("Sending data to RecognizerConsumer: ");
        console.log(e);
        this.worker.postMessage(e);
        if (e.command == 'stop') {
            this.stopped = true;
        }
    }
}

export = RecognizerConsumer;
