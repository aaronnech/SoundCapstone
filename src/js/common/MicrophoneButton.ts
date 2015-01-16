import SpeechProcessor = require('../speechprocessing/SpeechProcessor');

/**
 * Acts as a button for recording sound by interfacing with our speech processing singleton
 * For use in all application games
 */
class MicrophoneButton extends Phaser.Button {
    private speechProcessor : SpeechProcessor;
    private isActive : boolean;

    private static DISABLED_FRAME : number = 2;
    private static ACTIVE_FRAME : number = 1;
    private static NORMAL_FRAME : number = 0;

    constructor(game : Phaser.Game, x : number, y : number) {
        super(game, x, y, 'microphoneButton', this.onClickAction, this);
        this.frame = MicrophoneButton.NORMAL_FRAME;
        this.isActive = false;
        this.speechProcessor = SpeechProcessor.getInstance();
        game.add.existing(this);
    }

    private onClickAction() {
        if (this.isActive) {
            // Disable and process
            this.frame = MicrophoneButton.DISABLED_FRAME;
            this.isActive = false;
        } else {
            // Start processing
            this.frame = MicrophoneButton.ACTIVE_FRAME;
            this.isActive = true;
        }
    }
}

export = MicrophoneButton;