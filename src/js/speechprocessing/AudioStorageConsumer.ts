/**
 * AudioStorageConsumer is a consumer that simply stores all audio given to it.
 */
class AudioStorageConsumer {
    private samples : any;

    constructor() {
        this.samples = [];
    }

    /**
     * Get the samples stored by this storage consumer
     * @returns The samples stored.
     */
    public getSamples() {
        // Flattened samples
        return this.samples;
    }

    /**
     * Process the data dished out by the recorder
     */
    private processData(data : any) {
        this.samples.push(data);
    }

    /**
     * Called by web worker message postings via ducktyping
     * @param e The message posted
     */
    public postMessage(e : any) {
        console.log('TO CONSUMERS: ');
        console.log(e);
        switch (e.command) {
            case 'process':
                this.processData(e.data);
                break;
        }
    }
}

export = AudioStorageConsumer;