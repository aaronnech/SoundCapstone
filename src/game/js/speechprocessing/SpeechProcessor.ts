import SpeechSettings = require('./SpeechSettings');
import Microphone = require('./Microphone');
import WordBank = require('./WordBank');

/**
 * The speech processor singleton
 * This acts as the central speech therapy API endpoint for the rest of the program
 */
class SpeechProcessor {
    private static INSTANCE : SpeechProcessor = null;

    private settings : SpeechSettings;
    private microphone : Microphone;
    private wordBank : WordBank;

    private currentWord : string;

    /**
     * Should not be called directly. Use getInstance() instead.
     */
    constructor(callback ?: Function) {
        if (SpeechProcessor.INSTANCE != null) {
            throw 'Singleton already constructed!';
        }

        this.currentWord = null;

        this.settings = new SpeechSettings();
        this.wordBank = new WordBank();
        this.wordBank.setWords(this.settings.getWordBank());

        this.microphone = new Microphone(() => {
            console.log('Microphone ready.');
            if (callback) {
                callback();
            }
        }, this.settings);
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
     * Returns an integer representing correctness in the last word guess
     * @param result The result of microphone input processing
     * @return 0 if it was wrong, 1 if it is not quite right, and 2 if it is correct
     */
    public getCorrectness(result : any) {
        var pair = this.wordBank.getCurrentPair();
        // TODO: Do something with last result and pair
    }

    /**
     * Gets the next word in the bank
     * @returns {string} The word. Null if none available
     */
    public getNextWord() : any {
        this.currentWord = this.wordBank.next();
        return this.currentWord;
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