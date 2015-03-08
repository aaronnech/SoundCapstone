///<reference path="../def/phaser.d.ts" />

/**
 * Represents a text field in the game
 * which is a DOM text field floated over the game
 * and kept in context of the virtual pixel coordinates
 */
class DOMTextField {
    private game : Phaser.Game;
    private x : number;
    private y : number;
    private w : number;
    private h : number;

    constructor(game : Phaser.Game, x : number, y: number, w : number, h : number) {
        this.game = game;
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = w;

        this.addToCanvas();
    }


    private addToCanvas() {
        var parent = this.game.canvas.parentElement;
    }
}

export = DOMTextField;