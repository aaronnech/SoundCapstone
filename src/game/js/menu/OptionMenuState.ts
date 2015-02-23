///<reference path="../def/phaser.d.ts" />

import Server = require('../server/Server');

/**
 * The option menu of the application.
 */
class OptionMenuState extends Phaser.State {
    private server : Server;
    private keyText : Phaser.Text;
    private back : Phaser.Button;

    public preload() {
        this.server = Server.getInstance();
    }

    public create() {
        var key = this.server.getKey();
        var wordStyle = { font: "45px Arial", fill: "#333333", align: "center" };
        this.keyText = this.game.add.text(this.world.width / 3, this.world.height / 10, key, wordStyle);
        this.back = this.add.button(
            10, 10,
            'backButton', () => { this.onClickBack(this.game.state); }, this);
    }

    private onClickBack(state) {
        state.start('MainMenuState', true, false);
    }
}

export = OptionMenuState;