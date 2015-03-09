///<reference path="../def/phaser.d.ts" />
class BaloonInstructionState extends Phaser.State {

	private welcome : Phaser.Text;
	private beeInstructs : Phaser.Text;
	private bee : Phaser.Sprite;
	private honeyInstruct:Phaser.Text;
	private honeyInstruct2 : Phaser.Text;
	private honey : Phaser.Sprite;
	private glowingHoneyInstruct: Phaser.Text;
	private glowingHoney : Phaser.Sprite;
	private glowingHoneyInstruct2 : Phaser.Text;
	private glowingHoneyInstruct3 : Phaser.Text;
	private wasp : Phaser.Sprite;
	private waspInstruct : Phaser.Text;
	private height : number;
    private width : number;


	public create() {
			this.height = this.world.height;
        	this.width = this.world.width;
			var wordStyle = { font: "30px Oswald", fill: "#ffcc00", align: "center", stroke: '#af8c00', strokeThickness: 5 };
        	var welcomeStyle = { font: "80px Oswald", fill: "#ffcc00", align: "center", stroke: '#af8c00', strokeThickness: 5 };
        	this.welcome = this.game.add.text(this.width / 2, this.height / 20, "Welcome to Kimbee!", welcomeStyle);
        	this.welcome.anchor.x = 0.5;
        	this.bee = this.game.add.sprite(this.width / 8, this.height / 5, 'beeBig');
        	this.bee.scale.x = 0.7;
        	this.bee.scale.y = 0.7;
        	this.glowingHoney = this.game.add.sprite(this.width / 8, this.height * 3 / 5, 'fairy');
        	this.wasp = this.game.add.sprite(this.width / 8, this.height * 4 / 5, 'wasp');
        	this.beeInstructs = this.game.add.text(this.width / 5, this.bee.y, "This is Kimbee. Help Kimbee collect", wordStyle);
        	this.honey = this.game.add.sprite(this.beeInstructs.x + this.beeInstructs.width, this.height / 5, 'honey');
        	this.honeyInstruct2 = this.game.add.text(this.honey.x + this.honey.width, this.height / 5, "by moving her up and down.", wordStyle);
        	this.glowingHoneyInstruct = this.game.add.text(this.width / 5, this.height * 3 / 5, "This is a special kind of honey. When you", wordStyle);
        	this.glowingHoneyInstruct2 = this.game.add.text(this.width / 5, this.glowingHoneyInstruct.y + 40, "collect it, a microphone will pop up. If you", wordStyle);
        	this.glowingHoneyInstruct3 = this.game.add.text(this.width / 5, this.glowingHoneyInstruct2.y + 40, "say the word correctly in three tries you get 20 honey!", wordStyle);
        	this.glowingHoneyInstruct.anchor.x = 0;
        	this.waspInstruct = this.game.add.text(this.width / 6, this.height * 4 / 5, "Be careful of wasps though! They want to stop Kimbee, so don't run into them!", wordStyle);
        	this.waspInstruct.anchor.x = 0;
	}


	public update() {

	}
}
export = BaloonInstructionState;
