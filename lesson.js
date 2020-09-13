import { shuffle } from './shuffle.js';

(async () => {

	const lessonNumber = new URL(window.location).searchParams.get("les"); 
	var noSleep = new NoSleep();

	let module;
	try {
		module = await import(`./dictionaries/les${lessonNumber}.js`);
	} catch (err) {
		module = await import(`./dictionaries/${lessonNumber}.js`);
	}
	const dictionary = module.default;
	
	const shuffled = {};
	let subset = [], copy = [];
	let currentWord = undefined;
	let iteration = 0;

	window.setTimeout(() => {
		if (!window.voiceGB) {
			console.log("Voice not set, calling getVoices");
			window.speechSynthesis.getVoices();
		}
	}, 3000);

	window.speechSynthesis.onvoiceschanged = () => {
		window.voiceNL = window.speechSynthesis.getVoices().find(v => v.lang.indexOf('nl') > -1);
		window.voiceGB = window.speechSynthesis.getVoices().find(v => v.lang.indexOf('GB') > -1);
		document.getElementById("total").innerHTML = Object.keys(dictionary).length * 2;

		initialize();
	};

	function initialize() {		
		noSleep.enable();	
		shuffle(Object.keys(dictionary)).forEach(x => shuffled[x] = dictionary[x]);

		console.log("Starting data");	
		for (const [key, value] of Object.entries(shuffled)) {
			console.log(`${key}: ${value}`);
		}

		window.addEventListener('keydown', (e) => {
			if (e.key === 'ArrowRight') {
				nextWord();
			}
			if (e.key === 'ArrowLeft') {
				answer();
			}
		});

		addWords();
	}
	window.nextWord = () => {
		currentWord = copy.pop();

		if (currentWord) {
			console.log(`Popped: ${currentWord.text} (${copy.length} remaining)`);
		}
		
		let currentWordDiv = document.getElementById("word")
		currentWordDiv.innerHTML = currentWord.text;
		currentWordDiv.classList.remove("invisible");
		
		hideAnswerDiv();

		window.speechSynthesis.speak(currentWord);
		if (copy.length == 0) {
			if (subset.length === (Object.keys(dictionary).length) * 2) {
				window.speechSynthesis.speak(new SpeechSynthesisUtterance("You have finished, well done"));	
				noSleep.disable();
			} else {
				addWords();
			}
		}

		if (document.getElementById("timed").checked){
			window.answer(true);
			window.setTimeout(nextWord, parseInt(document.getElementById('delay').value));
		}
	}


	function hideAnswerDiv() {
		let answerDiv = document.getElementById("answer");
		answerDiv.innerHTML = "";
		answerDiv.classList.add("invisible");
	}

	window.answer = (silent) => {
		let answer;
		let utterance = new SpeechSynthesisUtterance();
		answer = dictionary[currentWord.text] || invertObject(dictionary)[currentWord.text];

		if (currentWord.lang === 'nl-NL'){
			utterance.voice = window.voiceGB;
		} else {
			utterance.voice = window.voiceNL;
		}
		utterance.text = answer;
		if (!silent) {
			window.speechSynthesis.speak(utterance);
		}
		document.getElementById("answer").innerHTML = answer;
		document.getElementById("answer").classList.remove("invisible");
	}

	function addWords() {
		console.log("---Adding words---");
		let size = parseInt(Object.keys(dictionary).length / parseInt(document.getElementById("chunks").value));
		let newWords = Object.keys(shuffled).slice(iteration * size, ++iteration * size);
		console.log(`New Words: ${newWords}`);
		subset.push(...newWords.map(w => wordToUtterance(w, window.voiceNL)));
		subset.push(...newWords.map(w => dictionary[w]).map(w => wordToUtterance(w, window.voiceGB)));
		copy = subset.slice();
		document.getElementById("words").innerHTML = copy.length;
		shuffle(copy);
		console.log(`All words: ${copy.map(x => x.text).join(', ')}. Size: ${copy.length}`);
	}

	function wordToUtterance(word, voice) {
		let utterance = new SpeechSynthesisUtterance(word);
		utterance.voice = voice;
		utterance.lang = voice.lang;
		return utterance;
	}

	function invertObject(obj) {
		return Object.assign({}, ...Object.entries(obj).map(([a,b]) => ({ [b]: a })))
	}
})();