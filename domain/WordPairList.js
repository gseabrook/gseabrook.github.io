class WordPairList {
	constructor(wordPairs) {
		this.wordPairs = wordPairs;
		this.words = [];
		wordPairs.forEach(wp => this.words.push(wp.dutch, wp.english));
		console.log(this.words);
	}

	findOpposite(word){
		let match = this.wordPairs.filter(wp => wp.english.text === word.text || wp.dutch.text === word.text);
		return word.language === 'EN' ? match[0].dutch : match[0].english;
	}

	getPairs(number){
		return this.wordPairs.slice(0, number);
	}
}

export default WordPairList;