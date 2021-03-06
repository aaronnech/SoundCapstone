import SpeechSettings = require('./SpeechSettings');

/**
 * RecognizerConsumer is a consumer that recognizes hypothesis based on a model.
 */
class RecognizerConsumer {
    private settings : SpeechSettings;
    private worker : Worker;
    private callbackIndex : number;
    private callbackSequence : Function[];

    private onStopped : Function;

    private words : any;
    private grammars : any;
    private hypotheses : any[];

    constructor(worker : Worker, settings : SpeechSettings, onStopped : Function) {
        this.onStopped = onStopped;
        this.worker = worker;
        this.worker.onmessage = (e) => {
            this.onWorkerMessage(e);
        }


        this.hypotheses = [];

        this.settings = settings;
        this.words = settings.getSphinxWords();
        this.grammars = settings.getSphinxGrammars();
    }

    /**
     * Initializes the worker, relies on the worker-message rely to
     * simulate callbacks tracked by this class state.
     * @param callback The function to be notified when ready
     */
    public initWorkerData(callback : Function) : void {
        this.worker.postMessage({'command' : 'initialize'});
        // Will execute these callbacks in sequence when worker responds to main UI thread after media loading.
        this.callbackSequence = [this.loadWords];
        for (var i = 0; i < this.grammars.length; i++) {
            var closure = ((i) => {
                return () => {
                    this.loadGrammar(i);
                };
            })(i);
            this.callbackSequence.push(closure);
        }
        this.callbackSequence.push(callback);
        this.callbackIndex = 0;
    }

    /**
     * Loads the words to recognize
     */
    private loadWords() : void {
        // load words
        console.log("ADDING WORDS");
        this.worker.postMessage({'command' : 'addWords', 'data' : this.words});
    }

    /**
     * Loads the ith grammar to recognize
     */
    private loadGrammar(i : number) : void {
        console.log("ADDING GRAMMAR " + i);
        this.worker.postMessage({'command' : 'addGrammar', 'data' : this.grammars[i].g});
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
        // Recognizer wants to notify us that particular task has a status.
        if (e.data.hasOwnProperty('id') && this.callbackIndex < this.callbackSequence.length) {
            this.callbackSequence[this.callbackIndex++].apply(this, []);
        }

        // Recognizer has a new hypothesis
        if (e.data.hasOwnProperty('hyp')) {
            this.hypotheses.push(e.data);
        }

        // Recognizer has a new hypothesis
        if (e.data.hasOwnProperty('final') && e.data.final) {
            this.onStopped();
        }
    }

    /**
     * Clears this consumers data store
     */
    public clear() : void {
        this.hypotheses = [];
    }

    /**
     * Called by web worker message postings via ducktyping
     * @param e The message posted to the worker
     */
    public postMessage(e : any) : void {
        this.worker.postMessage(e);
    }
}

export = RecognizerConsumer;
