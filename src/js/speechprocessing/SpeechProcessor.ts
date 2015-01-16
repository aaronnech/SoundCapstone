import SpeechSettings = require('./SpeechSettings');

/**
 * The speech processor is a singleton that can be configured
 */
class SpeechProcessor {
    private static INSTANCE : SpeechProcessor = null;

    private settings : SpeechSettings;

    /**
     * Should not be called directly. Use getInstance() instead.
     */
    constructor() {
        if (SpeechProcessor.INSTANCE != null) {
            throw 'Singleton already constructed!';
        }

        this.settings = new SpeechSettings();
    }

    /**
     * Gets the singleton instance of the speech processor
     *
     * @returns {SpeechProcessor} the speech processor instance
     */
    public static getInstance() : SpeechProcessor {
        if (SpeechProcessor.INSTANCE == null) {
            return new SpeechProcessor();
        }

        return SpeechProcessor.INSTANCE;
    }
}

export = SpeechProcessor;