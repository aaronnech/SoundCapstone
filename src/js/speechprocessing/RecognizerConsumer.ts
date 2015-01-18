/**
 * RecognizerConsumer is a consumer that recognizes hypothesis based on a model.
 */
class RecognizerConsumer {
    private worker : Worker;
    private callbackIndex : number;
    private callbackSequence : Function[];
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
        this.words = [["ONE", "W AH N"], ["TWO", "T UW"], ["THREE", "TH R IY"], ["FOUR", "F AO R"], ["FIVE", "F AY V"], ["SIX", "S IH K S"], ["SEVEN", "S EH V AH N"], ["EIGHT", "EY T"], ["NINE", "N AY N"], ["ZERO", "Z IH R OW"], ["NEW-YORK", "N UW Y AO R K"], ["NEW-YORK-CITY", "N UW Y AO R K S IH T IY"], ["PARIS", "P AE R IH S"] , ["PARIS(2)", "P EH R IH S"], ["SHANGHAI", "SH AE NG HH AY"], ["SAN-FRANCISCO", "S AE N F R AE N S IH S K OW"], ["LONDON", "L AH N D AH N"], ["BERLIN", "B ER L IH N"], ["SUCKS", "S AH K S"], ["ROCKS", "R AA K S"], ["IS", "IH Z"], ["NOT", "N AA T"], ["GOOD", "G IH D"], ["GOOD(2)", "G UH D"], ["GREAT", "G R EY T"], ["WINDOWS", "W IH N D OW Z"], ["LINUX", "L IH N AH K S"], ["UNIX", "Y UW N IH K S"], ["MAC", "M AE K"], ["AND", "AE N D"], ["AND(2)", "AH N D"], ["O", "OW"], ["S", "EH S"], ["X", "EH K S"]];
        this.grammar = {numStates: 1, start: 0, end: 0, transitions: [{from: 0, to: 0, word: "NEW-YORK"}, {from: 0, to: 0, word: "NEW-YORK-CITY"}, {from: 0, to: 0, word: "PARIS"}, {from: 0, to: 0, word: "SHANGHAI"}, {from: 0, to: 0, word: "SAN-FRANCISCO"}, {from: 0, to: 0, word: "LONDON"}, {from: 0, to: 0, word: "BERLIN"}]};
    }

    /**
     * Initializes the worker, relies on the worker-message rely to
     * simulate callbacks tracked by this class state.
     * @param callback The function to be notified when ready
     */
    public initWorkerData(callback : Function) : void {
        this.worker.postMessage({'command' : 'initialize'});
        // Will execute these callbacks in sequence when worker responds to main UI thread after media loading.
        this.callbackSequence = [this.loadWords, this.loadGrammar, callback];
        this.callbackIndex = 0;
        this.stopped = false;
    }

    /**
     * Loads the words to recognize
     */
    private loadWords() : void {
        // load words
        this.worker.postMessage({'command' : 'addWords', 'data' : this.words});
    }

    /**
     * Loads the grammar to recognize
     */
    private loadGrammar() : void {
        this.worker.postMessage({'command' : 'addGrammar', 'data' : this.grammar});
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
            console.log('FROM RECOGNIZER: ');
            console.log(e);
            // Recognizer wants to notify us that particular task has a status.
            if (e.data.hasOwnProperty('id') && this.callbackIndex < this.callbackSequence.length) {
                this.callbackSequence[this.callbackIndex++].apply(this, []);
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
        this.worker.postMessage(e);
        if (e.command == 'stop') {
            this.stopped = true;
        }
    }
}

export = RecognizerConsumer;
