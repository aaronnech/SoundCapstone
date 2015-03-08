///<reference path="../def/jquery.d.ts" />
declare var Hashids : any;

/**
 * The server API singleton
 * This acts as the central server API endpoint for the rest of the app
 */
class Server {
    private static URL : string = "/api/";

    private static INSTANCE : Server = null;

    private key : string;
    private enabled : boolean;

    /**
     * Should not be called directly. Use getInstance() instead.
     */
    constructor() {
        if (Server.INSTANCE != null) {
            throw 'Singleton already constructed!';
        }

        this.enabled = true;

        // Set the client token to a new generated token if one has not
        // been generated yet.
        var token : string = window.localStorage.getItem('token');
        if (token) {
            this.key = token;
        } else {
            var hash : any = new Hashids(Math.random() * 2147483647 + "");
            this.key = hash.encode((new Date()).getTime());
            window.localStorage.setItem('token', this.key);
        }

        console.log(this.key);
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
        return this.enabled && this.key != null;
    }

    /**
     * Get the client key used by the application
     * @return {string} The client key
     */
    public getKey() : string {
        return this.key;
    }

    /**
     * Sends a recording to the server
     * @param {number[]} rawData The raw data of the recording
     * @param {string} word The word they are saying
     */
    public sendRecording(rawData : any, word : string, correctness : number) : void {
        if (!this.canSend()) return;

        (<any> $).post(Server.URL + 'recording/add', {
            token : this.key,
            raw : rawData,
            word : word,
            correctness : correctness
        }, function(data) {
            console.log("Recording saved on server. Response:");
            console.log(data);
        });
    }
}

export = Server;