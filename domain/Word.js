class Word {
	constructor(text, language){
		this.text = text;
		this.language = language;
	}

	speak() {
		console.log(`Speaking ${this.text}`);
		let utterance = new SpeechSynthesisUtterance(this.text);
		utterance.voice = window['voice' + this.language];
		utterance.lang = utterance.voice.lang;
		window.speechSynthesis.speak(utterance);
	}
}

export default Word;