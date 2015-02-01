import SpeechSettings = require('./SpeechSettings');
import Microphone = require('./Microphone');

/**
 * The speech processor singleton
 * This acts as the central speech therapy API endpoint for the rest of the program
 */
class SpeechProcessor {
    private static INSTANCE : SpeechProcessor = null;

    private settings : SpeechSettings;
    private microphone : Microphone;

    /**
     * Should not be called directly. Use getInstance() instead.
     */
    constructor(callback ?: Function) {
        if (SpeechProcessor.INSTANCE != null) {
            throw 'Singleton already constructed!';
        }

        this.settings = new SpeechSettings();
        this.microphone = new Microphone(() => {
            console.log('Microphone ready.');
            if (callback) {
                callback();
            }
        });
    }

    /**
     * Gets the singleton instance of the speech processor
     * @param {Function?} callback The (optional) callback to call when the SpeechProcessor is fully constructed.
     * @returns {SpeechProcessor} the speech processor instance
     */
    public static getInstance(callback ?: Function) : SpeechProcessor {
        if (SpeechProcessor.INSTANCE == null) {
            SpeechProcessor.INSTANCE = new SpeechProcessor(callback);
        }

        return SpeechProcessor.INSTANCE;
    }

    /**
     * Start recording sound. Does nothing if sound is already being recorded.
     * @param callback The function to call when recording has started
     */
    public startRecording(callback) : void {
        this.microphone.start(callback);
    }

    /**
     * Stop recording sound. Returns the sound recorded
     * @returns {any} The sound samples recorded
     */
    public stopRecording() : any {
        // TODO: find return type
        return this.microphone.stop();
    }

    /**
     * Whether or not sound is being recorded
     * @returns {boolean} True if sound is being recorded, false otherwise
     */
    public isRecording() : boolean {
        return this.microphone.isRecording();
    }
}

export = SpeechProcessor;