///<reference path="./def/phaser.d.ts" />
import SpeechProcessor = require('./speechprocessing/SpeechProcessor');
import Server = require('./server/Server');

/**
 * The boot state of the Application
 * This state is visited briefly before the game loads completely
 */
class BootState extends Phaser.State {
    public preload() {
        this.load.image('backButton', 'img/back-button.png');
        this.load.image('menuBackground', 'img/menu-background.png');
        this.load.image('balloonsBackground', 'img/balloons-background.png');
        this.load.image('playButton', 'img/play-button.png');
        this.load.image('upButton', 'img/up-button.png');
        this.load.image('downButton', 'img/down-button.png');
        this.load.image('settingsButton', 'img/settings-button.png');
        this.load.image('combContainer', 'img/comb-container.png');
        this.load.image('gameIconBalloons', 'img/game-icon-balloons.png');
        this.load.image('gameIconMaze', 'img/game-icon-maze.png');
        this.load.spritesheet('beeBig', 'img/bee-big.png', 129, 108, 2);
        this.load.image('beeBasket', 'img/bee-basket.png');
        this.load.image('balloon', 'img/balloon.png');
        this.load.image('honey', 'img/honey.png');
        this.load.spritesheet('fairy', 'img/princess.png', 65, 75, 2);
        this.load.spritesheet('microphoneButton', 'img/microphone-button.png', 110, 110, 3);
        this.load.spritesheet('wasp', 'img/buff-wasp.png', 226 / 2, 90, 2);
        this.load.audio('tada', 'sfx/ta-da.mp3');
        this.load.audio('try-again', 'sfx/try-again.mp3');
        this.load.audio('honey-pickup', 'sfx/Honey_Pickup.wav');
    }

    public create() {
        var wordStyle = { font: "45px Arial", fill: "#333333", align: "center" };
        var text = this.game.add.text(this.world.width / 3, this.world.height / 10, "loading...", wordStyle);

        // Cause the game to go fullscreen
        this.game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
        // Maximum touches allowed at once
        this.input.maxPointers = 1;

        //  Phaser will automatically pause if the browser tab the game is in loses focus. Disable this
        this.stage.disableVisibilityChange = true;

        this.scale.pageAlignHorizontally = true;

        this.game.time.advancedTiming = true;

        if (this.game.device.desktop) {
            // Desktop Settings
        } else {
            // Mobile settings
        }

        // Get the singleton instances so construction happens during boot
        Server.getInstance();
        SpeechProcessor.getInstance(() => {
            console.log("Application Boot Complete. Starting game.");
            
            // Go to main menu
            this.game.state.start('MainMenuState', true, false);
        });
    }
}

export = BootState;