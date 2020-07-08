import Word from './Word.js'

class WordPair {
	constructor(dutch, english){
		this.english = new Word(english, 'EN');
		this.dutch = new Word(dutch, 'NL');
	}
}

export default WordPair;