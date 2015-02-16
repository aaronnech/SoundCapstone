import MicrophoneButton = require('../common/MicrophoneButton');
import SpeechProcessor = require('../speechprocessing/SpeechProcessor');


/**
 * The main balloon game state
 */
class BalloonGameState extends Phaser.State {
    private background : Phaser.Sprite;
    private basket : Phaser.Sprite;
    private balloon : Phaser.Sprite;
    private word : Phaser.Text;
    private microphone : MicrophoneButton;
    private speechProcessor : SpeechProcessor;

    public preload() {
        this.speechProcessor = SpeechProcessor.getInstance();
    }

    public create() {
        var firstWord = this.speechProcessor.getNextWord();
        var wordStyle = { font: "45px Arial", fill: "#333333", align: "center" };

        this.background = this.game.add.sprite(0, 0, 'balloonsBackground');
        this.basket = this.game.add.sprite(this.world.centerX - 38, this.world.height - 100, 'beeBasket');
        this.balloon = this.game.add.sprite(this.world.centerX - 20, this.world.height - 200, 'balloon');
        this.word = this.game.add.text(this.game.world.centerX-300, 200, "Now say: " + firstWord, wordStyle);
        this.microphone = new MicrophoneButton(this.game, 20, 20, (res) => { this.onMicrophoneFinish(res);} );
        this.game.add.tween(this.basket)
                     .to({y:this.world.height - 108}, 600, Phaser.Easing.Linear.None, true, 0, 1000, true);
    }

    private onMicrophoneFinish(result : any) {
        var correctness = this.speechProcessor.getCorrectness(result);
        console.log('CORRECTNESS: ' + correctness);

        // TODO(nickh): Make some effect or something happen on correct

        var nextWord = this.speechProcessor.getNextWord();
        this.word.setText("Now say: " + nextWord);
    }
}

export = BalloonGameState;