/**
 * Encapsulation of the speech settings specified by the user
 */
class SpeechSettings {
    private static DATA_MAP : any = {
        'RSOUND' : {
            wordBank : ["foo", "bar"],
            sphinxWordBank : [],
            sphinxGrammarBank : []
        }
    };

    private wordBank : string[];


    constructor() {

    }

    public setSound(soundType : string) {
        var dataBank = SpeechSettings.DATA_MAP[soundType];
        // set the word bank
        this.wordBank = dataBank.wordBank;
    }

    public getWordBank() {
        return this.wordBank;
    }
}

export = SpeechSettings;