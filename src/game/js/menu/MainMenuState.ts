///<reference path="../def/phaser.d.ts" />
/**
 * The main menu of the application.
 */
class MainMenuState extends Phaser.State {
    private static MINI_GAMES : any = [
        {state : 'BalloonGameState', icon : 'gameIconBalloons'},
        {state : 'MazeGameState', icon : 'gameIconMaze'}
    ];

    private play : Phaser.Button;
    private settings : Phaser.Button;
    private selectUp : Phaser.Button;
    private selectDown : Phaser.Button;
    private background : Phaser.Sprite;

    private combContainer : Phaser.Sprite;

    private gameIcon : Phaser.Sprite;

    private bee : Phaser.Sprite;

    private currentSelected : number;

    public preload() {

    }

    public create() {
        this.currentSelected = 0;
        this.background = this.game.add.sprite(0, 0, 'menuBackground');
        this.bee = this.game.add.sprite(930, 55, 'beeBig');

        this.combContainer = this.game.add.sprite(this.world.centerX - 230, 270, 'combContainer');

        this.selectUp = this.add.button(this.world.centerX - 200, 200, 'upButton', this.onClickSelectUp, this);
        this.selectDown = this.add.button(this.world.centerX - 200, 380, 'downButton', this.onClickSelectDown, this);
        this.play = this.add.button(
                            this.world.centerX + 50, 270,
                            'playButton', () => { this.onClickPlay(this.game.state); }, this);
        this.settings = this.add.button(
                            this.world.width - 50, this.world.height - 50,
                            'settingsButton', this.onClickSettings, this);
        // Animate the bee
        var anim = this.bee.animations.add('fly');
        anim.play(10, true);
        this.game.add.tween(this.bee).to({y:75}, 350, Phaser.Easing.Linear.None, true, 0, 1000, true);


        this.gameIcon = null;

        this.updateSelectedGame();
    }

    private updateSelectedGame() {
        var selectedMinigame = MainMenuState.MINI_GAMES[this.currentSelected];
        if (this.gameIcon != null) {
            this.gameIcon.destroy();
            this.gameIcon = null;
        }
        this.gameIcon = this.add.sprite(this.world.centerX - 219, 281, selectedMinigame.icon);
    }

    private onClickPlay(state) {
        // TODO: some animation?
        state.start(MainMenuState.MINI_GAMES[this.currentSelected].state, true, false);
    }

    private onClickSelectUp() {
        this.currentSelected += 1;
        this.currentSelected %= MainMenuState.MINI_GAMES.length;
        this.updateSelectedGame();
    }

    private onClickSelectDown() {
        this.currentSelected -= 1;
        if (this.currentSelected < 0) {
            this.currentSelected = MainMenuState.MINI_GAMES.length - 1;
        }
        this.updateSelectedGame();
    }

    private onClickSettings() {
        console.log('Settings!');
    }
}

export = MainMenuState;