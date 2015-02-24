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
    private wasp : Phaser.Group;
    private height : number;
    private width : number;
    private lastX : number;
    private gameOver : Phaser.Text;

    public preload() {
        this.speechProcessor = SpeechProcessor.getInstance();
    }

    public create() {
        var firstWord = this.speechProcessor.getNextWord();
        var wordStyle = { font: "45px Cambria", fill: "#333333", align: "center" };
        var gameOverStyle = { font: "80px Cambria", fill: "#000000", align: "center" };
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

        this.wasp = this.game.add.group();
        this.wasp.enableBody = true;
        this.wasp.physicsBodyType = Phaser.Physics.ARCADE;

        this.gameOver = this.game.add.text(this.width / 3, this.height / 10, "GAME OVER\nClick to Play Again", gameOverStyle);
        this.gameOver.visible = false;
        this.game.time.events.loop(Phaser.Timer.SECOND, this.spawnHoney, this);
        this.game.time.events.loop(Phaser.Timer.SECOND * 5, this.spawnWasp, this);

        this.game.paused = false;

        this.game.input.onDown.add((ev) => { this.reset(ev); }, self);
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

    public waspCollision(bee : Phaser.Sprite, wasp : Phaser.Sprite) {
        bee.kill();
        this.game.paused = true;
        this.word.visible = false;
        this.gameOver.visible = true;
    }

    private spawnWasp() {
        var w = this.wasp.create(this.width, this.game.world.randomY, 'wasp');
        w.setOutOfBoundsKill = true;
        w.body.velocity.x = this.width / -5;
    }

    private spawnHoney() {
        var h = this.honey.create(this.width, this.game.world.randomY, 'honey');
        h.setOutOfBoundsKill = true;
        h.body.velocity.x = this.width / -5;
    }

    private reset(event : any) {
        if(this.game.paused) {
            this.honey.removeAll();
            this.wasp.removeAll();
            this.bee.revive();
            this.bee.y = this.height / 2;
            this.gameOver.visible = false;
            this.word.visible = true;
            this.game.paused = false;
        }
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
                this.bee.body.velocity.y = this.height / 3;
            }

            if (this.game.input.mousePointer.y < this.bee.body.y) {
                this.bee.body.velocity.y = this.height / -3;
            }

            if (this.game.input.mousePointer.y > this.bee.body.bottom && this.game.input.mousePointer.y < this.bee.body.top) {
                this.bee.body.velocity.y = 0;
            }
        } else {
            this.bee.body.velocity.y = 0;
        }
        this.game.physics.arcade.collide(this.bee, this.honey, this.honeyCollision, null, this);
        this.game.physics.arcade.collide(this.bee, this.wasp, this.waspCollision, null, this);
    }
}

export = BalloonGameState;