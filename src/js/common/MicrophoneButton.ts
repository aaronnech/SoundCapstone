import SpeechProcessor = require('../speechprocessing/SpeechProcessor');

/**
 * Acts as a button for recording sound by interfacing with our speech processing singleton
 * For use in all application games
 */
class MicrophoneButton extends Phaser.Button {
    private speechProcessor : SpeechProcessor;
    private isActive : boolean;
    private isDisabled : boolean;
    private clientResultCallback : Function;

    private static DISABLED_FRAME : number = 2;
    private static ACTIVE_FRAME : number = 1;
    private static NORMAL_FRAME : number = 0;

    /**
     * Constructs a microphone button
     *
     * @param game The game context to attach the button to
     * @param x The x coordinate to place the button
     * @param y The y coordinate to place the button
     * @param dataCallback A function callback that is executed on finishing recording with the data
     */
    constructor(game : Phaser.Game, x : number, y : number, dataCallback : Function) {
        super(game, x, y, 'microphoneButton', this.onClickAction, this);
        this.frame = MicrophoneButton.NORMAL_FRAME;
        this.clientResultCallback = dataCallback;
        this.isActive = false;
        this.isDisabled = false;
        this.speechProcessor = SpeechProcessor.getInstance();
        game.add.existing(this);
    }

    /**
     * Disables the button, disabling all functionality. If the microphone button is in the middle
     * of recording, the recording will be thrown out.
     */
    public disable() {
        // Throw any current recordings away.
        if (this.speechProcessor.isRecording()) {
            this.speechProcessor.stopRecording();
        }
        this.frame = MicrophoneButton.DISABLED_FRAME;
        this.isDisabled = true;
    }

    /**
     * Enables the button, showing the current active state.
     */
    public enable() {
        this.frame = this.isActive ? MicrophoneButton.ACTIVE_FRAME : MicrophoneButton.NORMAL_FRAME;
        this.isDisabled = false;
    }

    /**
     * Called on button click
     */
    private onClickAction() {
        if (!this.isDisabled) {
            if (this.isActive) {
                this.isActive = false;
                this.frame = MicrophoneButton.NORMAL_FRAME;
                this.clientResultCallback(this.speechProcessor.stopRecording());
            } else {
                this.isActive = true;
                // Switch visual state and start processing
                this.frame = MicrophoneButton.ACTIVE_FRAME;
                this.speechProcessor.startRecording();
            }
        }
    }
}

export = MicrophoneButton;