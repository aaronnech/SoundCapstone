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
            ["RABBIT", "R AE B AH T"], ["WABBIT", "W AE B AH T"],
            ["AIR", "EH R"], ["AIW", "EH W"],
            ["ARE", "AA R"], ["AWE", "AA W"],
            ["BAR", "B AA R"], ["BAW", "B AA W"],
            ["BEAR", "B EH R"], ["BEAW", "B EH W"],
            ["BOAR", "B AO R"], ["BOAW", "B AO W"],
            ["CAR", "K AA R"], ["CAW", "K AA W"],
            ["CARE", "K EH R"], ["CAWE", "K EH W"]
        ],

        sphinxGrammars : [
            {word : "GREEN", g : {numStates: 2, start: 0, end: 1, transitions: [{from: 0, to: 1, word: "GWEEN"}, {from: 0, to: 1, word: "GREEN"}]}},
            {word : "RABBIT", g : {numStates: 2, start: 0, end: 1, transitions: [{from: 0, to: 1, word: "WABBIT"}, {from: 0, to: 1, word: "RABBIT"}]}},
            {word : "AIR", g : {numStates: 2, start: 0, end: 1, transitions: [{from: 0, to: 1, word: "AIW"}, {from: 0, to: 1, word: "AIR"}]}},
            {word : "ARE", g : {numStates: 2, start: 0, end: 1, transitions: [{from: 0, to: 1, word: "AWE"}, {from: 0, to: 1, word: "ARE"}]}},
            {word : "BAR", g : {numStates: 2, start: 0, end: 1, transitions: [{from: 0, to: 1, word: "BAW"}, {from: 0, to: 1, word: "BAR"}]}},
            {word : "BEAR", g : {numStates: 2, start: 0, end: 1, transitions: [{from: 0, to: 1, word: "BEAW"}, {from: 0, to: 1, word: "BEAR"}]}},
            {word : "BOAR", g : {numStates: 2, start: 0, end: 1, transitions: [{from: 0, to: 1, word: "BOAW"}, {from: 0, to: 1, word: "BOAR"}]}},
            {word : "CAR", g : {numStates: 2, start: 0, end: 1, transitions: [{from: 0, to: 1, word: "CAW"}, {from: 0, to: 1, word: "CAR"}]}},
            {word : "CARE", g : {numStates: 2, start: 0, end: 1, transitions: [{from: 0, to: 1, word: "CAWE"}, {from: 0, to: 1, word: "CARE"}]}}
        ],

        /* Target sounds */
        R : {
            wordBank : [
                {right : "GREEN", wrong : "GWEEN"},
                {right : "RABBIT", wrong : "WABBIT"},
                {right : "AIR", wrong : "AIW"},
                {right : "ARE", wrong : "AWE"},
                {right : "BAR", wrong : "BAW"},
                {right : "BEAR", wrong : "BEAW"},
                {right : "BOAR", wrong : "BOAW"},
                {right : "CAR", wrong : "CAW"},
                {right : "CARE", wrong : "CAWE"}
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
     * @param level the word bank level
     * @returns {string[]} The bank of words
     */
    public getWordBank() {
        return this.wordBank;
    }
}

export = SpeechSettings;