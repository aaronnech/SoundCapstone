/**
 * Acts as a button for recording sound by interfacing with our speech processing singleton
 * For use in all application games
 */
class MicrophoneButton extends Phaser.Button {

    constructor(game : Phaser.Game, x : number, y : number) {
        super(game, x, y, 'microphoneButton', this.onClickAction, this);
        this.onInputOver.add(this.onOverAction, this);
        this.onInputOut.add(this.onOutAction, this);
        this.onInputUp.add(this.onUpAction, this);
    }

    private onClickAction() {

    }

    private onUpAction() {

    }

    private onOutAction() {

    }

    private onOverAction() {

    }
}

export = MicrophoneButton;