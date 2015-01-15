import MicrophoneButton = require('../common/MicrophoneButton');

/**
 * The main balloon game state
 */
class BalloonGameState extends Phaser.State {
    private background : Phaser.Sprite;
    private basket : Phaser.Sprite;
    private balloon : Phaser.Sprite;

    public preload() {

    }

    public create() {
        this.background = this.game.add.sprite(0, 0, 'balloonsBackground');
        this.basket = this.game.add.sprite(this.world.centerX - 38, this.world.height - 100, 'beeBasket');
        this.balloon = this.game.add.sprite(this.world.centerX - 20, this.world.height - 200, 'balloon')
        this.game.add.tween(this.basket)
                     .to({y:this.world.height - 108}, 600, Phaser.Easing.Linear.None, true, 0, 1000, true);
    }
}

export = BalloonGameState;