let props = {
	engrus: true,
	game: {
		readAndListen: true,
		listen: false
	},
	words: {
		ran: true,
		ver: false,
		irr: false,
		adv: false,
		adj: false,
		phv: false
	},
	strFilter: ''
}

let loader = null,
	page = null,
	helpIcon = null,
	themeIcon = null,
	backIcon = null,
	gameIcon = null,
	testIcon = null,
	modal = null,
	modalTitle = null,
	modalText = null,
	modalData = null,
	modalClose = null,
	btnNew = null,
	sound = null,
	menu = null,
	correctCounter = null,
	newList = [],
	nextWord = [],
	versions = [],
	strNewWord = null,
	strPercent = null,
	progress = null,
	mp3 = null,
	path = {
		word: '',
		check: './audio/check.mp3',
		ok: './audio/ok.mp3',
		err: './audio/error.mp3'
	},
	limitWords = null,
	currentWord = null,
	percent = null,
	numbersTry = 0,
	correctWord = null;

function delLoader() {
	setTimeout(() => {
		loader.parentNode.removeChild(loader);
	}, 500);
}
function toogleTheme() {
	if (!page.dataset.theme) {
		page.dataset.theme = 'dark';
		themeIcon.classList.toggle('icons__theme--moon');
		page.style.setProperty('--baseDark', ' #181f30');
		page.style.setProperty('--baseLight', ' #38486a');
		page.style.setProperty('--lightText', ' #fbd888');
		page.style.setProperty('--baseText', ' #c6ffdd');
	} else {
		page.dataset.theme = '';
		themeIcon.classList.toggle('icons__theme--moon');
		page.style.setProperty('--baseDark', ' #fbd888');
		page.style.setProperty('--baseLight', ' #c6ffdd');
		page.style.setProperty('--lightText', ' #26373f');
		page.style.setProperty('--baseText', ' #181f30');
	}
}
function getValueProps(selector) {
	return document.querySelector(selector).checked;
}
function getFilterList(list, value) {
	let temp = [];
	let limit = null;

	if (!value) {
		temp = list.slice();
	} else {
		if (Number.isInteger(1 * value)) {
			limit = (1 * value < 6) ? limit = 6 : 1 * value;
			temp = list.slice(0, limit);
		} else {
			limit = null;
			let reg = '[' + value.toLowerCase() + ']';
			let regExp = new RegExp(reg, 'i');
			for (let i = 0; i < list.length; i++) {
				if (regExp.test(list[i][1][0])) {
					temp.push(list[i]);
				}
			}
		}
	}
	return temp;
}
function getWordsList(list, bool) {
	let temp = list.slice();
	let rev = [];
	if (!bool) {
		return temp.shuffle();
	} else {
		temp = temp.shuffle();
		rev = temp.deepReverse();
		return rev;
	}
}
function toogleElement(elem, clazz) {
	elem.classList.toggle(clazz);
}
function addElement(elem, clazz) {
	elem.classList.add(clazz);
}
function removeElement(elem, clazz) {
	elem.classList.remove(clazz);
}
function getColor(value) {
	let hue = ((value) * 120).toString(10);
	return ["hsl(", hue, ",100%,50%)"].join("");
}
function setCorrect() {
	percent = 0;
	if (currentWord > 0) {
		percent = (100 * correctCounter / numbersTry).toFixed(1);
	} else {
		percent = percent.toFixed(1);
	}
	strPercent.textContent = percent;
	progress.style.backgroundColor = getColor(percent / 100);
	progress.style.width = percent + '%';
	if (percent === 0) {
		progress.style.background = 'none';
		progress.style.width = 0;
	}

}
function shuffleMulti(arr) {
	let one = [];
	let temp = [];
	for (let i = 0; i < arr.length; i++) {
		one[i] = i;
	}
	one.shuffle();
	for (let i = 0; i < arr.length; i++) {
		temp[i] = arr[one[i]];
	}
	return temp;
}
function setPathSound(bool) {
	let src = '';
	let firstVerb = '';
	let phrasal = '';
	nextWord = newList[currentWord];
	if (bool) {
		strNewWord.textContent = nextWord[0];
		src = nextWord[1].substr(0, 3);
		if (src === 'irr') {
			firstVerb = nextWord[0].split(',', 1).toString();
			path.word = "./audio/" + src + '_/' + firstVerb + ".mp3";
		} else if (src === 'phv') {
			phrasal = nextWord[0].replace(' ', '');
			path.word = "./audio/" + src + '_/' + phrasal + ".mp3";
		} else {
			path.word = "./audio/" + src + '_/' + nextWord[0] + ".mp3";
		}

	} else {
		strNewWord.textContent = nextWord[0].substr(4);
		src = nextWord[0].substr(0, 3);
		if (src === 'irr') {
			firstVerb = nextWord[1].split(',', 1).toString();
			path.word = "./audio/" + src + '_/' + firstVerb + ".mp3";
		} else if (src === 'phv') {
			phrasal = nextWord[1].replace(' ', '');
			path.word = "./audio/" + src + '_/' + phrasal + ".mp3";
		} else {
			path.word = "./audio/" + src + '_/' + nextWord[1] + ".mp3";
		}
	}
}
function renderWords(bool) {
	setPathSound(props.engrus);
	if (props.game.listen && bool) {
		strNewWord.textContent = '- - - - - - -';
	}
	if (!bool) {
		playAudio(path.check);
	} else {
		playAudio(path.word);
	}
	let variants = [];
	for (let i = 0; i < newList.length; i++) {
		if (newList[i][0] !== nextWord[0]) {
			variants[variants.length] = newList[i].slice();
		}
	}
	let tempArr = shuffleMulti(variants);
	let vs = [];
	for (let i = 0; i < 5; i++) {
		vs[i] = tempArr[i].slice();
	}
	vs[vs.length] = nextWord.slice();
	let vss = [];
	for (let i = 0; i < vs.length; i++) {
		vss[i] = vs[i].slice();
	}
	let vssRandom = shuffleMulti(vss);
	if (bool) {
		for (let i = 0; i < vssRandom.length; i++) {
			versions[i].textContent = vssRandom[i][1].substr(4);
		}
	} else {
		for (let i = 0; i < vssRandom.length; i++) {
			versions[i].textContent = vssRandom[i][1];
		}
	}
}

function isCorrect(element, hisClass, elements, theirClass){
	for (let i = 0; i < elements.length; i++) {
		if (elements[i] === element) {
			addElement(element, hisClass);
			continue;
		} else {
			addElement(elements[i], theirClass);
		}
	}
}
function isError(element, hisClass, elements, theirClass){
	for (let i = 0; i < elements.length; i++) {
		if (elements[i] === element) {
			addElement(element, hisClass);
			setTimeout(() => {
				addElement(elements[i], theirClass);
			}, 500);
			break;
		}
	}
}
function isStart(elements, clazz){
	for (let i = 0; i < elements.length; i++) {
		elements[i].classList.remove(clazz);
		elements[i].classList.remove('win');
		elements[i].classList.remove('lose');
	}
}
function checkWord() {
	numbersTry++;
	(props.engrus)
	? correctWord = nextWord[1].substr(4)
	: correctWord = nextWord[1];
	let card = this;
	if (card.textContent === correctWord) {
		correctCounter++;
		playAudio(path.ok);
		isCorrect(card, 'win', versions, 'hidden');
		if (currentWord + 1 === limitWords) {
			setTimeout(() => {
				theEnd();
			}, 1000);
		}
		setTimeout(() => {
			wordNext();
		}, 800);
	} else {
		playAudio(path.err);
		isError(card, 'lose', versions, 'hidden');
	}
}
function theEnd() {
	modalTitle.innerHTML = titleEnd;
	modalText.innerHTML = subtitleEnd;
	modalData.innerHTML = percent + ' %.';
	toogleElement(modal, 'modal--show');
	toogleElement(menu, 'menu--show');
}
function wordNext() {
	isStart(versions, 'hidden');
	currentWord++;
	setCorrect();
	if (currentWord < limitWords) {
		renderWords(props.engrus);
	}
}
function playAudio(path) {
	mp3.src = path;
	mp3.play();
}
function letsGo() {
	// remember settings
	props.engrus = getValueProps('.choice__input[name="direction"][data-dir="engrus"]');
	props.game.readAndListen = getValueProps('.choice__input[name="game"][data-test="readandlisten"]');
	props.game.listen = getValueProps('.choice__input[name="game"][data-test="listen"]');
	props.words.ran = getValueProps('.choice__input[name="words"][data-word="ran"]');
	props.words.ver = getValueProps('.choice__input[name="words"][data-word="ver"]');
	props.words.irr = getValueProps('.choice__input[name="words"][data-word="irr"]');
	props.words.adv = getValueProps('.choice__input[name="words"][data-word="adv"]');
	props.words.adj = getValueProps('.choice__input[name="words"][data-word="adj"]');
	props.words.phv = getValueProps('.choice__input[name="words"][data-word="phv"]');
	props.strFilter = document.querySelector('.submit__input').value;

	irregularVerbsList.shuffle();
	verbsList.shuffle();
	adverbsList.shuffle();
	adjectivesList.shuffle();
	phrasalVerbsList.shuffle();

	// create an array of words
	let filterSumList = [];
	let flag = false;
	if (props.words.ran) {
		let randomList = [];
		randomList = verbsList.concat(irregularVerbsList, adverbsList, adjectivesList, phrasalVerbsList);
		randomList.shuffle();
		getFilterList(randomList, `10`).forEach(element => {
			filterSumList.push(element);
		});
	} else if (props.words.ver) {
		getFilterList(verbsList, props.strFilter).forEach(element => {
			filterSumList.push(element);
		});
	} else if (props.words.irr) {
		getFilterList(irregularVerbsList, props.strFilter).forEach(element => {
			filterSumList.push(element);
		});
	} else if (props.words.adv) {
		getFilterList(adverbsList, props.strFilter).forEach(element => {
			filterSumList.push(element);
		});
	} else if (props.words.adj) {
		getFilterList(adjectivesList, props.strFilter).forEach(element => {
			filterSumList.push(element);
		});
	} else if (props.words.phv) {
		getFilterList(phrasalVerbsList, props.strFilter).forEach(element => {
			filterSumList.push(element);
		});
	} else {
		flag = true;
		modalTitle.innerHTML = titleStart;
		modalText.innerHTML = '';
		modalData.innerHTML = '';
		toogleElement(modal, 'modal--show');
	}
	newList = getWordsList(filterSumList, props.engrus);

	// close the start screen
	if (!flag) {
		toogleElement(menu, 'menu--show');


		// display the necessary elements
		if (!props.game.readAndListen) {
			removeElement(gameIcon, 'counter__icon--show');
			addElement(testIcon, 'counter__icon--show');
		} else {
			removeElement(testIcon, 'counter__icon--show');
			addElement(gameIcon, 'counter__icon--show');
		}

		// reset counters
		limitWords = newList.length;
		currentWord = 0;
		correctCounter = 0;
		numbersTry = 0;
		isStart(versions, 'hidden');
		setCorrect();

		// add words into fields
		renderWords(props.engrus);
	}
}

document.addEventListener('DOMContentLoaded', function () {
	loader = document.querySelector('.loader');
	page = document.querySelector('#page');
	modal = document.querySelector('.modal');
	helpIcon = document.querySelector('.icons__help');
	modalTitle = document.querySelector('.modal__title');
	modalText = document.querySelector('.modal__text');
	modalData = document.querySelector('.modal__data');
	modalClose = document.querySelector('.modal__close');
	helpIcon.addEventListener('click', function () {
		modalTitle.innerHTML = title;
		modalText.innerHTML = subtitle;
		modalData.innerHTML = '';
		toogleElement(modal, 'modal--show');
	});
	modalClose.addEventListener('click', function () {
		toogleElement(modal, 'modal--show');
	});
	themeIcon = document.querySelector('.icons__theme');
	themeIcon.addEventListener('click', toogleTheme);
	btnNew = document.querySelector('.submit__button');
	btnNew.addEventListener('click', letsGo);
	sound = document.querySelector('.audio__icon');
	sound.addEventListener('click', function(){
		playAudio(path.word);
	});
	menu = document.querySelector('.menu');
	backIcon = document.querySelector('.counter__icon-back');
	backIcon.addEventListener('click', function () {
		toogleElement(menu, 'menu--show');
	});
	gameIcon = document.querySelector('.counter__icon-game');
	testIcon = document.querySelector('.counter__icon-test');
	strPercent = document.querySelector('.counter__persent-text');
	progress = document.querySelector('.progress-bar');
	strNewWord = document.querySelector('.ask__word');
	mp3 = document.querySelector('.audio');
	versions = document.querySelectorAll('.version__button');
	for (let i = 0; i < versions.length; i++) {
		versions[i].addEventListener('click', checkWord);
	}

	setTimeout(() => {
		loader.classList.add('loader--hide');
		delLoader();
	}, 3500);

});
