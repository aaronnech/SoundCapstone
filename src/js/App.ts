///<reference path="./def/phaser.d.ts"/>

/**
 * Main Application class
 */
class App {

    private static SERVER_ADDRESS : string = 'localhost';
    private phaser : Phaser.Game;

    constructor() {
        var state : any = {
            preload : this.onPreload,
            create: this.onCreate,
            update : this.onUpdate,
            render : this.onRender
        };
        this.phaser = new Phaser.Game(800, 600, Phaser.AUTO, '', state);
        (<any> this.phaser.scale).scaleMode = Phaser.ScaleManager.SHOW_ALL;
        (<any> this.phaser.renderer).resize(window.innerWidth, window.innerHeight);
    }

    private onPreload() {
        // TODO: Load media, etc
    }

    private onCreate() {
        // TODO: Called when application is first created,
        // Add hooks to input and such here
        // E.g. :
        // this.game.input['onDown'].add(this.onMouseDown, this);
    }

    private onUpdate() {
        // TODO: CALLED ON UPDATE
    }

    private onRender() {
        // TODO: CALLED ON RENDER
    }
}

export = App;
