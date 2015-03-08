/**
 * WordBank is a managed collection of words to speak
 */
class WordBank {
    private current : number;
    private words : any[];

    constructor() {
        this.words = [];
        this.current = 0;
    }

    /**
     * Sets the current word bank
     * @param wordBank The word bank to set
     */
    public setWords(wordBank : string[]) {
        this.words = wordBank;
        this.current = 0;
    }

    /**
     * Gets the current (right/wrong) pair
     * @returns {any|null} The pair, null if not found
     */
    public getCurrentPair() {
        return this.words[this.current] || null;
    }

    /**
     * Gets the current (right/wrong) index
     * @returns {number} The index
     */
    public getCurrentIndex() {
        return this.current;
    }

    /**
     * Gets the next word to display, returns null if one is not
     * available.
     * @returns {string} The word
     */
    public next() : string {
        if (this.words.length == 0) return null;

        this.current++;
        this.current %= this.words.length;

        var pair = this.words[this.current];

        return pair.right;
    }
}

export = WordBank;