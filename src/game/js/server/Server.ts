/**
 * The server API singleton
 * This acts as the central server API endpoint for the rest of the app
 */
class Server {
    // If a heartbeat takes over 10000 milliseconds to complete,
    // We should go into offline mode
    private static TIMEOUT : number = 10000;

    private static INSTANCE : Server = null;

    /**
     * Should not be called directly. Use getInstance() instead.
     */
    constructor() {
        if (Server.INSTANCE != null) {
            throw 'Singleton already constructed!';
        }
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
}

export = Server;