/**
 * The main menu of the application.
 */
class MainMenuState extends Phaser.State {
    private play : Phaser.Button;
    private settings : Phaser.Button;
    private selectUp : Phaser.Button;
    private selectDown : Phaser.Button;
    private background : Phaser.Sprite;

    public preload() {

    }

    public create() {
        this.background = this.game.add.sprite(0, 0, 'menuBackground');

        this.selectUp = this.add.button(this.world.centerX - 200, 200, 'upButton', this.onClickSelectUp, this);
        this.selectDown = this.add.button(this.world.centerX - 200, 380, 'downButton', this.onClickSelectDown, this);
        this.play = this.add.button(this.world.centerX + 50, 270, 'playButton', this.onClickPlay, this);
        this.settings = this.add.button(
                            this.world.width - 50,
                            this.world.height - 50,
                            'settingsButton',
                            this.onClickSettings, this);
    }

    private onClickPlay() {
        console.log('PLAY!');
    }

    private onClickSelectUp() {
        console.log('UP!');
    }

    private onClickSelectDown() {
        console.log('DOWN!');
    }

    private onClickSettings() {
        console.log('Settings!');
    }
}

export = MainMenuState;