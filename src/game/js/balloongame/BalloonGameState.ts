///<reference path="../def/phaser.d.ts" />
import MicrophoneButton = require('../common/MicrophoneButton');
import HoneyCounter = require('../common/HoneyCounter');
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
    private honeyCounter : HoneyCounter;
    private wasp : Phaser.Group;
    private fairy : Phaser.Group;
    private height : number;
    private width : number;
    private lastX : number;
    private lost : boolean;
    private lastHoneyX : number;
    private honeyChain : number;
    private micPause : boolean;
    private gameOver : Phaser.Text;

    public preload() {
        this.speechProcessor = SpeechProcessor.getInstance();
    }

    public create() {
        var firstWord = this.speechProcessor.getNextWord();
        var wordStyle = { font: "45px Cambria", fill: "#333333", align: "center" };
        var gameOverStyle = { font: "80px Cambria", fill: "#000000", align: "center" };
        this.tada = this.game.add.audio('tada');
        this.tryagain = this.game.add.audio('try-again');

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
        this.microphone.visible = false;

        this.honeyCounter = new HoneyCounter(this.game, this.width * 4 / 5, 20);

        this.honey = this.game.add.group();
        this.honey.enableBody = true;
        this.honey.physicsBodyType = Phaser.Physics.ARCADE;

        this.wasp = this.game.add.group();
        this.wasp.enableBody = true;
        this.wasp.physicsBodyType = Phaser.Physics.ARCADE;

        this.fairy = this.game.add.group();
        this.fairy.enableBody = true;
        this.fairy.physicsBodyType = Phaser.Physics.ARCADE;

        this.gameOver = this.game.add.text(this.width / 3, this.height / 10, "GAME OVER\nClick to Play Again", gameOverStyle);
        this.gameOver.visible = false;
        this.game.time.events.loop(Phaser.Timer.SECOND / 2, this.spawnHoney, this);
        this.game.time.events.loop(Phaser.Timer.SECOND * 5, this.spawnWasp, this);
        this.game.time.events.loop(Phaser.Timer.SECOND * 5, this.spawnFairy, this);

        this.game.paused = false;

        this.lastHoneyX = this.game.world.randomY;
        this.honeyChain = Math.floor(Math.random() * 5);
        this.lost = false;
        this.micPause = false;

        this.game.input.onDown.add((ev) => { this.reset(ev); }, self);
    }

    private onCorrect() {
        this.tada.play();
        var nextWord = this.speechProcessor.getNextWord();
        this.word.setText("Now say: " + nextWord);
        this.word.visible = false;
        this.game.paused = false;
        this.microphone.visible = false;
        this.honeyCounter.addHoney(20);    
        this.unpause();
    }

    private onWrong() {
        this.tryagain.play();
    }

    private honeyCollision(bee : Phaser.Sprite, honey : Phaser.Sprite) {
        honey.kill();
        this.honeyCounter.addHoney(1);
    }

    private waspCollision(bee : Phaser.Sprite, wasp : Phaser.Sprite) {
        bee.kill();
        this.lost = true;
        this.game.paused = true;
        this.gameOver.visible = true;
    }

    private fairyCollision(bee : Phaser.Sprite, fairy : Phaser.Sprite) {
        fairy.kill();
        this.microphone.visible = true;
        this.word.visible = true;
        this.pause();
    }


    private spawnFairy() {
        if(!this.micPause) {
            var f = this.fairy.create(this.width, this.game.world.randomY, 'fairy');
            f.setOutOfBoundsKill = true;
            var anim = f.animations.add('fly');
            anim.play(10, true);
            f.body.velocity.x   = this.width / -5;
        }
    }
    private spawnWasp() {
        if(!this.micPause) {
            var w = this.wasp.create(this.width, this.game.world.randomY, 'wasp');
            w.setOutOfBoundsKill = true;
            w.body.velocity.x = this.width / -5;
        }
    }

    private spawnHoney() {
        if(!this.micPause) {
            if (this.honeyChain < 5) { 
                var r = Math.floor(Math.random() * 3);
                if (r == 0) {
                    this.lastHoneyX = this.lastHoneyX + 75;
                } else if (r == 1) {
                    this.lastHoneyX = this.lastHoneyX - 75;
                }
                var h = this.honey.create(this.width, this.lastHoneyX, 'honey');
                h.setOutOfBoundsKill = true;
                h.body.velocity.x = this.width / -5;
                this.honeyChain = this.honeyChain + 1;
            } else {
                if (Math.floor(Math.random() * 2) == 0) {
                    this.honeyChain = Math.floor(Math.random() * 5);
                    this.lastHoneyX = this.game.world.randomY;
                }
            }
        }
    }

    private reset(event : any) {
        if(this.lost) {
            this.honey.removeAll();
            this.wasp.removeAll();
            this.fairy.removeAll();
            this.bee.revive();
            this.bee.y = this.height / 2;
            this.gameOver.visible = false;
            this.word.visible = true;
            this.game.paused = false;
            this.lost = false;
        }
    }

    private pause() {
        this.micPause = true;
        this.honey.setAll('body.velocity.x', 0);
        this.wasp.setAll('body.velocity.x', 0);
        this.fairy.setAll('body.velocity.x', 0);  
    }

    private unpause() {
        this.micPause = false;
        this.honey.setAll('body.velocity.x', this.width / -5);
        this.wasp.setAll('body.velocity.x', this.width / -5);
        this.fairy.setAll('body.velocity.x', this.width / -5);  
    }

    private freeze(sprite:Phaser.Sprite) {
        sprite.body.velocity.x = 0;
    }


    private onMicrophoneFinish(result : any) {
        var correctness = this.speechProcessor.getCorrectness(result);
        console.log('CORRECTNESS: ' + correctness);

        if(correctness == 0) {
            this.onWrong();
        }

        if(correctness == 2) {
            this.onCorrect();
        }
    }

    public update() {
        if (this.game.input.mousePointer.isDown && !this.micPause) {
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
        this.game.physics.arcade.collide(this.bee, this.fairy, this.fairyCollision, null, this);
    }
}

export = BalloonGameState;