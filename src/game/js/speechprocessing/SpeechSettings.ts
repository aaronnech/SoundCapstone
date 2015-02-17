/**
 * Encapsulation of the speech settings specified by the user
 */
class SpeechSettings {
    private static DEFAULT_SOUND : any = 'R';
    private static DATA_MAP : any = {

        /*
        Global sphinx maps
        (contain all words possible and their phonemes and recognition grammars)
        */
        sphinxWords : [
            ["GREEN", "G R IY N"], ["GWEEN", "G W IY N"],
            ["RABBIT", "R AE B AH T"], ["WABBIT", "W AE B AH T"]
            /*["AIR", "EH R"], ["AIW", "EH W"]
            ["ARE", "AA R"], ["AWE", "AA W"]
            ["BAR", "B AA R"], ["BAW", "B AA W"]
            ["BEAR", "B EH R"], ["BEAW", "B EH W"]
            ["BOAR", "B AO R"], ["BOAW", "B AO W"]
            ["CAR", "K AA R"], ["CAW", "K AA W"]
            ["CARE", "K EH R"], ["CAWE", "K EH W"]*/
        ],

        sphinxGrammars : [
            {word : "GREEN", g : {numStates: 2, start: 0, end: 1, transitions: [{from: 0, to: 1, word: "GWEEN"}, {from: 0, to: 1, word: "GREEN"}]}},
            {word : "RABBIT", g : {numStates: 2, start: 0, end: 1, transitions: [{from: 0, to: 1, word: "WABBIT"}, {from: 0, to: 1, word: "RABBIT"}]}}
        ],

        /* Target sounds */
        R : {
            wordBank : [
                {right : "GREEN", wrong : "GWEEN"},
                {right : "RABBIT", wrong : "WABBIT"}
            ]
        }

    };

    private wordBank : string[];

    constructor() {
        this.setSound(SpeechSettings.DEFAULT_SOUND);
    }

    /**
     * Sets a particular problem area sound to work on
     * @param soundType The sound type to work on
     */
    public setSound(soundType : string) {
        var dataBank = SpeechSettings.DATA_MAP[soundType];

        // set state of the settings to the data
        this.wordBank = dataBank.wordBank;
    }

    /**
     * Get the map of sphinx grammars
     * @returns {any} The sphinx grammars
     */
    public getSphinxGrammars() {
        return SpeechSettings.DATA_MAP.sphinxGrammars;
    }

    /**
     * Get the map of sphinx words
     * @returns {any} The sphinx grammars
     */
    public getSphinxWords() {
        return SpeechSettings.DATA_MAP.sphinxWords;
    }

    /**
     * Gets the current bank of words
     * @returns {string[]} The bank of words
     */
    public getWordBank() {
        return this.wordBank;
    }
}

export = SpeechSettings;