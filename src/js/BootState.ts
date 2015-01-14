/**
 * The boot state of the Application
 * This state is visited briefly before the game loads completely
 */
class BootState extends Phaser.State {
    public preload() {
        this.load.image('menuBackground', 'img/menu-background.png');
        this.load.image('playButton', 'img/play-button.png');
        this.load.image('upButton', 'img/up-button.png');
        this.load.image('downButton', 'img/down-button.png');
        this.load.image('settingsButton', 'img/settings-button.png');
        this.load.image('combContainer', 'img/comb-container.png');
        this.load.image('gameIconBalloons', 'img/game-icon-balloons.png')
        this.load.image('gameIconMaze', 'img/game-icon-maze.png')
    }

    public create() {
        // Cause the game to go fullscreen
        (<any> this.game.scale).scaleMode = Phaser.ScaleManager.SHOW_ALL;
        // Maximum touches allowed at once
        this.input.maxPointers = 1;

        //  Phaser will automatically pause if the browser tab the game is in loses focus. Disable this
        this.stage.disableVisibilityChange = true;

        if (this.game.device.desktop) {
            // Desktop Settings
            this.scale.pageAlignHorizontally = true;
        } else {
            // Mobile settings
        }

        // Go to main menu
        this.game.state.start('MainMenuState', true, false);
    }
}

export = BootState;