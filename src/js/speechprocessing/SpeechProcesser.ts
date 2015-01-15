import SpeechSettings = require('./SpeechSettings');

/**
 * The speech processor is a singleton that can be configured
 */
class SpeechProcesser {
    private static INSTANCE : SpeechProcesser = null;

    private settings : SpeechSettings;

    /**
     * Should not be called directly. Use getInstance() instead.
     */
    constructor() {
        if (SpeechProcesser.INSTANCE != null) {
            throw 'Singleton already constructed!';
        }

        this.settings = new SpeechSettings();
    }

    /**
     * Gets the singleton instance of the speech processor
     *
     * @returns {SpeechProcessor} the speech processor instance
     */
    public static getInstance() : SpeechProcesser {
        if (SpeechProcesser.INSTANCE == null) {
            return new SpeechProcesser();
        }

        return SpeechProcesser.INSTANCE;
    }
}

export = SpeechProcesser;