///<reference path="../def/phaser.d.ts" />
import MicrophoneButton = require('../common/MicrophoneButton');
import SpeechProcessor = require('../speechprocessing/SpeechProcessor');


/**
 * The main balloon game state
 */
class BalloonGameState extends Phaser.State {
    private background : Phaser.Sprite;
    private bee : Phaser.Sprite;
    private balloon : Phaser.Sprite;
    private flower : Phaser.Sprite;
    private honey : Phaser.Group;
    private tada : Phaser.Sound;
    private tryagain : Phaser.Sound;
    private word : Phaser.Text;
    private microphone : MicrophoneButton;
    private speechProcessor : SpeechProcessor;
    private height : number;
    private width : number;
    private lastX : number;

    public preload() {
        this.speechProcessor = SpeechProcessor.getInstance();
    }

    public create() {
        var firstWord = this.speechProcessor.getNextWord();
        var wordStyle = { font: "45px Arial", fill: "#333333", align: "center" };
        this.tada = this.game.add.audio('tada');
        this.tryagain = this.game.add.audio('tryagain');

        this.height = this.world.height;
        this.width = this.world.width;
        this.lastX = this.width / 5;


        this.background = this.game.add.sprite(0, 0, 'balloonsBackground');
        this.flower = this.game.add.sprite(this.width * 4 / 5, this. height / 2, 'flower');
        this.bee = this.game.add.sprite(this.width / 5, this.height / 2, 'beeBig');
        this.bee.scale.x = 0.7;
        this.bee.scale.y = 0.7;
        var anim = this.bee.animations.add('fly');
        anim.play(10, true);
        this.game.physics.enable(this.bee, Phaser.Physics.ARCADE);
        this.bee.body.immovable = true;
        this.bee.body.velocity.x = 0;
        this.word = this.game.add.text(this.width / 3, this.height / 10, "Now say: " + firstWord, wordStyle);
        this.microphone = new MicrophoneButton(this.game, 20, 20, (res) => { this.onMicrophoneFinish(res);} );
        this.honey = this.game.add.group();
        this.honey.enableBody = true;
        this.honey.physicsBodyType = Phaser.Physics.ARCADE;
        this.game.time.events.loop(Phaser.Timer.SECOND, this.spawnHoney, this);
    }

    private onCorrect() {
        this.tada.play();
        this.bee.body.velocity.x = this.width / 10;
    }

    private onWrong() {
        this.tryagain.play();
    }

    public honeyCollision(bee : Phaser.Sprite, honey : Phaser.Sprite) {
        honey.kill();
    }

    private spawnHoney() {
        var h = this.honey.create(this.width, this.game.world.randomY, 'honey');
        h.body.velocity.x = this.width / -5;
    }


    private onMicrophoneFinish(result : any) {
        var correctness = this.speechProcessor.getCorrectness(result);
        console.log('CORRECTNESS: ' + correctness);

        if(correctness == 0) {
            this.onWrong();
        }

        if(correctness == 2) {
            this.onCorrect();
            var nextWord = this.speechProcessor.getNextWord();
            this.word.setText("Now say: " + nextWord);
        }
    }

    public update() {
        if (this.game.input.mousePointer.isDown) {
            if (this.game.input.mousePointer.y > this.bee.body.y) {
                this.bee.body.velocity.y = this.height / 5;
            }

            if (this.game.input.mousePointer.y < this.bee.body.y) {
                this.bee.body.velocity.y = this.height / -5;
            }  

            if (this.game.input.mousePointer.y > this.bee.body.bottom && this.game.input.mousePointer.y < this.bee.body.top) {
                this.bee.body.velocity.y = 0;
            }
        } else {
            this.bee.body.velocity.y = 0;
        }
        this.game.physics.arcade.collide(this.bee, this.honey, this.honeyCollision, null, this);
    }
}

export = BalloonGameState;