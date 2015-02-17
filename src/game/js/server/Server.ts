/**
 * The server API singleton
 * This acts as the central server API endpoint for the rest of the app
 */
class Server {
    // If a heartbeat takes over 10000 milliseconds to complete,
    // We should go into offline mode
    private static TIMEOUT : number = 10000;

    private static INSTANCE : Server = null;

    private key : string;

    /**
     * Should not be called directly. Use getInstance() instead.
     */
    constructor() {
        if (Server.INSTANCE != null) {
            throw 'Singleton already constructed!';
        }

        this.key = null;
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
    private canSend() {
        return this.key != null;
    }

    /**
     * Sets the client key to connect to the server
     * @param key
     */
    public setKey(key : string) {
        this.key = key;
    }
}

export = Server;