///<reference path="./def/phaser.d.ts"/>

/**
 * Main Application class
 */
class App {

    private static SERVER_ADDRESS : string = 'localhost';
    private phaser : Phaser.Game;

    constructor() {
        var state : any = {
            preload : () => { this.onPreload(); },
            create: () => { this.onCreate(); },
            update : () => { this.onUpdate(); },
            render : () => { this.onRender(); }
        };
        this.phaser = new Phaser.Game(800, 600, Phaser.AUTO, '', state);
    }

    private onPreload() {
        // TODO: Load media, etc
    }

    private onCreate() {
        // TODO: Called when application is first created,

        // Cause the game to go fullscreen
        (<any> this.phaser.scale).scaleMode = Phaser.ScaleManager.SHOW_ALL;
    }

    private onUpdate() {
        // TODO: CALLED ON UPDATE
    }

    private onRender() {
        // TODO: CALLED ON RENDER
    }
}

export = App;
