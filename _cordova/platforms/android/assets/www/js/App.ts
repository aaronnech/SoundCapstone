///<reference path="./def/phaser.d.ts" />
import SpeechProcessor = require('./speechprocessing/SpeechProcessor');

// Boot state
import BootState = require('./BootState');

// Menu states
import MainMenuState = require('./menu/MainMenuState');
import OptionMenuState = require('./menu/OptionMenuState');

// Maze game states
import MazeGameState = require('./mazegame/MazeGameState');

// Balloon game states
import BalloonGameState = require('./balloongame/BalloonGameState');

/**
 * Main Application class
 */
class App extends Phaser.Game {

    constructor() {
        super(1280, 720, Phaser.AUTO, '', null);

        // Setup states
        this.state.add("BootState", BootState);
        this.state.add("MainMenuState", MainMenuState);
        this.state.add("OptionMenuState", OptionMenuState);
        this.state.add("BalloonGameState", BalloonGameState);
        this.state.add("MazeGameState", MazeGameState);

        // Start application
        this.state.start("BootState");
    }
}

export = App;
