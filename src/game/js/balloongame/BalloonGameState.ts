///<reference path="../def/phaser.d.ts" />
import MicrophoneButton = require('../common/MicrophoneButton');
import HoneyCounter = require('../common/HoneyCounter');
import SpeechProcessor = require('../speechprocessing/SpeechProcessor');


/**
 * The main balloon game state
 */
class BalloonGameState extends Phaser.State {
    private background : Phaser.TileSprite;
    private bee : Phaser.Sprite;
    private balloon : Phaser.Sprite;
    private honey : Phaser.Group;
    private tada : Phaser.Sound;
    private tryagain : Phaser.Sound;
    private honeyPickup : Phaser.Sound;
    private word : Phaser.Text;
    private microphone : MicrophoneButton;
    private speechProcessor : SpeechProcessor;
    private honeyCounter : HoneyCounter;
    private wasp : Phaser.Group;
    private fairy : Phaser.Group;
    private height : number;
    private width : number;
    private topBound : number;
    private bottomBound : number;
    private lastX : number;
    private lost : boolean;
    private lastHoneyX : number;
    private honeyChain : number;
    private micPause : boolean;
    private spawnWasp : boolean;
    private gameOver : Phaser.Text;
    private level : number;
    private numCorrect : number;
    private numWrong : number;
    private first : boolean;

    public preload() {
        this.speechProcessor = SpeechProcessor.getInstance();
    }

    public create() {
        var firstWord = this.speechProcessor.getNextWord(1);
        var wordStyle = { font: "45px Oswald", fill: "#ffcc00", align: "center", stroke: '#af8c00', strokeThickness : 5};
        var gameOverStyle = { font: "80px Oswald", fill: "#ffcc00", align: "center", stroke: '#af8c00', strokeThickness : 5};
        this.tada = this.game.add.audio('tada');
        this.tryagain = this.game.add.audio('try-again');
        this.honeyPickup = this.game.add.audio('honey-pickup');
        Phaser.Physics.Arcade.TILE_BIAS = 40;
        
        this.height = this.world.height;
        this.width = this.world.width;
        this.lastX = this.width / 5;
        this.topBound = this.height / 10;
        this.bottomBound = this.world.height - this.height / 5;

        this.first = true;

        this.background = this.game.add.tileSprite(0, 0, this.width, this.height, 'balloonsBackground');
        this.bee = this.game.add.sprite(this.width / 5, this.height / 2, 'beeBig');
        this.bee.scale.x = 0.7;
        this.bee.scale.y = 0.7;
        var anim = this.bee.animations.add('fly');
        anim.play(10, true);
        this.game.physics.enable(this.bee, Phaser.Physics.ARCADE);
        this.bee.body.immovable = true;
        this.bee.body.velocity.x = 0;
        this.word = this.game.add.text(this.width / 2, this.height / 10, "Now say: " + firstWord, wordStyle);
        this.word.anchor.x = 0.5;
        this.word.visible = false;
        this.microphone = new MicrophoneButton(this.game, 20, 20, (res) => { this.onMicrophoneFinish(res);} );
        this.microphone.visible = false;

        this.honeyCounter = new HoneyCounter(this.game, this.width * 4 / 5, 20);

        this.honey = this.game.add.group();
        this.honey.enableBody = true;
        this.honey.physicsBodyType = Phaser.Physics.ARCADE;

        this.wasp = this.game.add.group();
        this.wasp.enableBody = true;
        this.wasp.physicsBodyType = Phaser.Physics.ARCADE;

        this.spawnWasp = true;

        this.fairy = this.game.add.group();
        this.fairy.enableBody = true;       
        this.fairy.physicsBodyType = Phaser.Physics.ARCADE;

        this.gameOver = this.game.add.text(this.width / 2, this.height / 10, "GAME OVER\nClick to Play Again", gameOverStyle);
        this.gameOver.anchor.x = 0.5;
        this.gameOver.visible = false;
        this.game.time.events.loop(Phaser.Timer.SECOND / 2, this.spawnHoney, this);
        this.game.time.events.loop(Phaser.Timer.SECOND * 2.5, this.spawnWaspOrFairy, this);

        this.game.paused = false;

        this.level = 1;
        this.numCorrect = 0;
        this.numWrong = 0;

        this.lastHoneyX = this.game.world.randomY;
        this.honeyChain = Math.floor(Math.random() * 3);
        this.lost = false;
        this.micPause = false;

        this.game.input.onDown.add((ev) => { this.reset(ev); }, self);
    }

    private onCorrect() {
        this.tada.play();
        this.numWrong = 0;
        if(this.numCorrect == 3) {
            if(this.level != 4) {
                this.level = this.level + 1;
            }
            this.numCorrect = 0;
        } else {
            this.numCorrect = this.numCorrect + 1;
        }
        var nextWord = this.speechProcessor.getNextWord(this.level);
        this.word.setText("Now say: " + nextWord);
        this.word.visible = false;
        this.game.paused = false;
        this.microphone.visible = false;
        this.honeyCounter.addHoney(20);    
        this.unpause();
    }

    private onWrong() {
        if(this.numWrong == 2) {
            if(this.numCorrect == -3) {
                if(this.level != 1) {
                    this.level = this.level - 1;
                }
                this.numCorrect = 0;
            } else {
            this.numCorrect = this.numCorrect - 1;
            }
            this.numWrong = 0;
            var nextWord = this.speechProcessor.getNextWord(this.level);
            this.word.setText("Now say: " + nextWord);
            this.word.visible = false;
            this.game.paused = false;
            this.microphone.visible = false; 
            this.unpause();
        } else {
            this.tryagain.play();
            this.numWrong = this.numWrong + 1;
        }
    }

    private honeyCollision(bee : Phaser.Sprite, honey : Phaser.Sprite) {
        honey.kill();
        this.honeyPickup.play();
        this.honeyCounter.addHoney(1);
    }

    private waspCollision(bee : Phaser.Sprite, wasp : Phaser.Sprite) {
        bee.kill();
        this.lost = true;
        this.word.visible = false;
        this.game.paused = true;
        this.gameOver.setText("GAME OVER\nClick to Play Again");
        this.gameOver.visible = true;
    }

    private fairyCollision(bee : Phaser.Sprite, fairy : Phaser.Sprite) {
        fairy.kill();
        this.microphone.visible = true;
        if (this.first) {
            var firstWord = this.speechProcessor.getNextWord(this.level);
            this.word.setText("Now say: " + firstWord);
            this.first = false;
        }
        this.word.visible = true;
        this.pause();
    }

    private spawnWaspOrFairy() {
        if(!this.micPause) {
            if(this.spawnWasp) { 
                var rand = this.game.world.randomY;
                while(rand > this.bottomBound || rand < this.topBound) {
                    rand = this.game.world.randomY;
                }
                var w = this.wasp.create(this.width, rand, 'wasp');
                w.outOfBoundsKill = true;
                w.checkWorldBounds = true;
                w.scale.x = 0.7;
                w.scale.y = 0.7;
                var anim = w.animations.add('fly');
                anim.play(10, true);
                w.body.velocity.x = this.width / (Math.floor(Math.random() * 3) + -5);
                this.spawnWasp = false;
            } else {
                var rand = this.game.world.randomY;
                while(rand > this.bottomBound || rand < this.topBound) {
                    rand = this.game.world.randomY;
                }
                var f = this.fairy.create(this.width, rand, 'fairy');
                f.outOfBoundsKill = true;
                f.checkWorldBounds = true; 
                var anim = f.animations.add('fly');
                anim.play(10, true);
                f.body.velocity.x   = this.width / (Math.floor(Math.random() * 3) + -5);
                this.spawnWasp = true;
            }
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
                h.outOfBoundsKill = true;
                h.checkWorldBounds = true;
                h.body.velocity.x = this.width / -5;
                this.honeyChain = this.honeyChain + 1;
            } else {
                if (Math.floor(Math.random() * 2) == 0) {
                    this.honeyChain = Math.floor(Math.random() * 3);
                    this.lastHoneyX = this.game.world.randomY;
                    while(this.lastHoneyX > this.bottomBound || this.lastHoneyX < this.topBound) {
                        this.lastHoneyX = this.game.world.randomY;
                    }
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

        if(correctness == 0 || correctness == 1) {
            this.onWrong();
        }

        if(correctness == 2) {
            this.onCorrect();
        }
    }

    public update() {
        if(this.first) {
            this.honeyCounter.addHoney(0);
        }
        if(!this.micPause) {
            this.background.tilePosition.x -= 1;
        }
        if (this.game.input.mousePointer.isDown && !this.micPause) {
            if (this.game.input.mousePointer.y > this.bee.body.y - this.bee.body.height / 4) {
                this.bee.body.velocity.y = this.height / 3;
            }

            if (this.game.input.mousePointer.y < this.bee.body.y + this.bee.body.height / 4) {
                this.bee.body.velocity.y = this.height / -3;
            }

            if (this.game.input.mousePointer.y > this.bee.body.y + this.bee.body.height / 4 && this.game.input.mousePointer.y < this.bee.body.bottom - this.bee.body.height / 4) {
                this.bee.body.velocity.y = 0;
            }
        } else if (this.game.input.pointer1.isDown && !this.micPause) {
            if (this.game.input.pointer1.y > this.bee.body.y - this.bee.body.height / 4) {
                this.bee.body.velocity.y = this.height / 3;
            }

            if (this.game.input.pointer1.y < this.bee.body.y + this.bee.body.height / 4) {
                this.bee.body.velocity.y = this.height / -3;
            }

            if (this.game.input.pointer1.y > this.bee.body.y + this.bee.body.height / 4 && this.game.input.pointer1.y < this.bee.body.bottom - this.bee.body.height / 4) {
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