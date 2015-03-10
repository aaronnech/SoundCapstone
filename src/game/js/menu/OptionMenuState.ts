///<reference path="../def/phaser.d.ts" />

import Server = require('../server/Server');

/**
 * The option menu of the application.
 */
class OptionMenuState extends Phaser.State {
    private server : Server;
    private keyText : Phaser.Text;
    private back : Phaser.Button;
    private first : boolean;

    public preload() {
        this.server = Server.getInstance();
    }

    public create() {
        this.first = true;
        var key = this.server.getKey();
        var wordStyle = { font: "45px Oswald", fill: "#ffcc00", align: "center", stroke: '#af8c00', strokeThickness : 5};
        this.keyText = this.game.add.text(this.world.width / 3, this.world.height / 10,  "", wordStyle);
        this.back = this.add.button(
            10, 10,
            'backButton', () => { this.onClickBack(this.game.state); }, this);
    }

    private onClickBack(state) {
        state.start('MainMenuState', true, false);
    }

    public update() {
        if(this.first) {
            this.keyText.setText("Key: " + this.server.getKey());
            this.first = true;
        }
    }
}

export = OptionMenuState;