///<reference path="../def/phaser.d.ts" />

class HoneyCounter extends Phaser.Sprite {
	private count : number;
	private countText : Phaser.Text;

	/**
     * Constructs a honey counter
     *
     * @param game The game context to attach the button to
     * @param x The x coordinate to place the honey counter
     * @param y The y coordinate to place the honey counter

     */
    constructor(game : Phaser.Game, x : number, y : number) {
        super(game, x, y, 'honey');
        var wordStyle = { font: "45px Oswald", fill: "#ffcc00", align: "center", stroke: '#af8c00', strokeThickness : 5 };
        this.count = 0;
        this.countText = game.add.text(x + 60, y, "" + this.count, wordStyle);
        this.countText.setText("" + this.count);
        game.add.existing(this);
    }

    /*
	 * Adds num to the current count of the honey counter
	 *
	 * @param num the number to add to the honey counter
    */
    public addHoney(num : number) {
    	this.count = this.count + num;	
    	this.countText.setText("" + this.count);
    }
}

export = HoneyCounter;