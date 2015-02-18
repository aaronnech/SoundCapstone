///<reference path="../def/jquery.d.ts" />

/**
 * The server API singleton
 * This acts as the central server API endpoint for the rest of the app
 */
class Server {
    // If a heartbeat takes over 10000 milliseconds to complete,
    // We should go into offline mode
    private static TIMEOUT : number = 10000
    private static URL : string = "/api/";

    private static INSTANCE : Server = null;

    private key : string;

    /**
     * Should not be called directly. Use getInstance() instead.
     */
    constructor() {
        if (Server.INSTANCE != null) {
            throw 'Singleton already constructed!';
        }

        // TODO: Hard coded for now
        this.key = '62233980-b7a5-11e4-8bd3-adc946e88124';
    }

    /**
     * Gets the singleton instance of the API
     * @returns {API} the speech processor instance
     */
    public static getInstance() : Server {
        if (Server.INSTANCE == null) {
            Server.INSTANCE = new Server();
        }

        return Server.INSTANCE;
    }

    /**
     * Helper returns true if this client can send information to the server
     * @returns {boolean} True if we can send, false otherwise
     */
    private canSend() : boolean {
        return this.key != null;
    }

    /**
     * Sets the client key to connect to the server
     * @param {string} key The client key
     */
    public setKey(key : string) : void {
        this.key = key;
    }

    /**
     * Sends a recording to the server
     * @param {number[]} rawData The raw data of the recording
     * @param {string} word The word they are saying
     */
    public sendRecording(rawData : any, word : string) : void {
        console.log('SENDING CHILD RECORDING DATA: ');
        console.log(rawData);
        console.log('FOR WORD ' + word);

        if (!this.canSend()) return;

        (<any> $).post(Server.URL + 'recording/add', {
            childId : this.key,
            raw : rawData,
            word : word
        }, function(data) {
           console.log(data);
        });
    }
}

export = Server;