import dictionary from './dictionaries/les_all.js'
import { shuffle } from './shuffle.js'
import WordPair from './domain/WordPair.js'
import WordPairList from './domain/WordPairList.js'

const shuffled = {};

const filteredRandomisedKeys = shuffle(Object.keys(dictionary)).splice(0, 6);
filteredRandomisedKeys.forEach(x => shuffled[x] = dictionary[x]);
console.log(shuffled);

const wordPairs = Object.entries(shuffled).map((x) => new WordPair(...x));
const wordPairList = new WordPairList(wordPairs);
const playedWords = [];

window.speechSynthesis.onvoiceschanged = () => {
	window.voiceNL = window.speechSynthesis.getVoices().find(v => v.lang === "nl-NL");
	window.voiceEN = window.speechSynthesis.getVoices().find(v => v.lang === "en-GB");

	// document.getElementById("total").innerHTML = Object.keys(dictionary).length * 2;
};

window.play = function(){
	playSubSet(2);
	playSubSet(4);
	playSubSet(6);
}

function playSubSet(index){
	const subset = new WordPairList(wordPairList.getPairs(index));
	const words = shuffle(subset.words);

	words.forEach(word => {
		word.speak();
		if (firstTimeHearingWord(word)){
			console.log(`Not heard ${word.text} before, saying opposite`);
			subset.findOpposite(word).speak();
			playedWords.push(word);
		} else {
			console.log(`Heard ${word.text} before, moving on`);
		}
	});
}

function firstTimeHearingWord(word){
	return playedWords.indexOf(word) === -1;
}
