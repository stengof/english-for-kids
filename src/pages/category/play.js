import state from '../state';

function importAll(r) {
  return r.keys().map(r);
}

let audioPaths = importAll(require.context('../../assets/audio', false, /\.(mp3|mp4|wav)$/));
audioPaths = audioPaths.map((v) => v.default);
const audioNames = require.context('../../assets/audio', false, /\.(mp3|mp4|wav)$/).keys();
const reload = importAll(require.context('../../assets/category', false, /\.(png|jpe?g|svg)$/));
const effects = importAll(require.context('../../assets/effects', false, /\.(mp3|mp4|wav)$/));
const stars = importAll(require.context('../../assets/results', false, /\.(png|jpe?g|svg)$/));
const endImgs = importAll(require.context('../../assets/end-game', false, /\.(png|jpe?g|svg)$/));

function shuffleArray(array) {
  const arr = array;
  for (let i = arr.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    const temp = arr[i];
    arr[i] = arr[j];
    arr[j] = temp;
  }
  return arr;
}

function playCardSound(name) {
  const audioEl = document.createElement('audio');
  const fileName = `./${name}.mp3`;
  const indexPath = audioNames.indexOf(fileName);
  const readyPath = audioPaths[indexPath];
  audioEl.setAttribute('src', readyPath);
  audioEl.play();
}

function playSound(url) {
  const audioEl = document.createElement('audio');
  audioEl.setAttribute('src', url);
  audioEl.play();
}

function changeStateToTrue() {
  state.setItem('in-game', 'true');
}

function changeStateToFalse() {
  state.setItem('in-game', 'false');
}

class Play {
  constructor() {
    this.currentPlayCard = 0;
    this.mistakes = 0;
    this.domCards = document.querySelectorAll('.card-link');
    this.correctSound = effects[0].default;
    this.errorSound = effects[1].default;
    this.failureSound = effects[2].default;
    this.successSound = effects[3].default;
    [this.failureSmileLink, this.successSmileLink] = [endImgs[0], endImgs[1]];
    this.results = document.querySelector('.results');
    this.whiteStar = document.createElement('img');
    this.whiteStar.classList.add('star');
    this.whiteStar.setAttribute('src', stars[0]);
    this.whiteStar.setAttribute('alt', 'white star');
    this.yellowStar = document.createElement('img');
    this.yellowStar.classList.add('star');
    this.yellowStar.setAttribute('src', stars[1]);
    this.yellowStar.setAttribute('alt', 'yellow star');
  }

  init() {
    this.runAfterClickOnButton();
  }

  getCards(cardNames) {
    this.shuffeledCardNames = shuffleArray(cardNames);
  }

  runAfterClickOnButton() {
    this.gameButton = document.querySelector('.game-button');
    this.gameButton.addEventListener('click', () => {
      if (state.getItem('in-game') === 'true') {
        this.repeatMessage();
      } else {
        changeStateToTrue();
        this.changeButtonToReload();
        this.addEventListenerToEveryCard();
        this.repeatMessage();
      }
    });
  }

  changeButtonToReload() {
    if (!this.gameButton.classList.contains('active')) {
      this.gameButton.classList.add('active');
      this.gameButton.textContent = '';
      this.gameButton.style.backgroundImage = `url(${reload})`;
    }
  }

  addEventListenerToEveryCard() {
    this.domCards.forEach((el) => el.addEventListener('click', this.gameProcess.bind(this, el), true));
  }

  createEndGame() {
    this.endGame = document.createElement('div');
    this.endGame.classList.add('end-game');
  }

  createSuccesSmile() {
    this.successSmile = document.createElement('img');
    this.successSmile.classList.add('end-img');
    this.successSmile.setAttribute('src', this.successSmileLink);
  }

  createFailureSmile() {
    this.failureSmile = document.createElement('img');
    this.failureSmile.classList.add('end-img');
    this.failureSmile.setAttribute('src', this.failureSmileLink);
  }

  createMistakesElement() {
    this.mistakesElment = document.createElement('p');
    this.mistakesElment.classList.add('mistakes');
    this.mistakesElment.textContent = `Mistakes: ${this.mistakes}`;
  }

  gameProcess(element) {
    function redirectToMainPageAfterTimeout() {
      setTimeout(() => {
        window.location.href = './index.html';
      }, 3500);
    }
    const clickedCardWord = element.querySelector('.card-title').textContent;
    if (clickedCardWord === this.shuffeledCardNames[this.currentPlayCard] && !element.classList.contains('disabled')) {
      element.classList.add('disabled');
      this.currentPlayCard += 1;
      if (this.currentPlayCard >= 8) {
        this.createEndGame();
        this.createSuccesSmile();
        this.createFailureSmile();
        this.createMistakesElement();
        document.body.innerHTML = '';
        document.body.append(this.endGame);
        if (!this.mistakes) {
          playSound(this.successSound);
          this.endGame.append(this.successSmile);
          redirectToMainPageAfterTimeout();
        } else if (this.mistakes > 0) {
          playSound(this.failureSound);
          this.endGame.append(this.failureSmile, this.mistakesElment);
          redirectToMainPageAfterTimeout();
        }
        changeStateToFalse();
      } else {
        this.results.prepend(this.yellowStar.cloneNode());
        playSound(this.correctSound);
        const playbinded = playCardSound.bind(this, this.shuffeledCardNames[this.currentPlayCard]);
        setTimeout(playbinded, 1000);
      }
    } else if (!element.classList.contains('disabled')) {
      this.results.prepend(this.whiteStar.cloneNode());
      playSound(this.errorSound);
      this.mistakes += 1;
    }
  }

  repeatMessage() {
    if (this.gameButton.classList.contains('active')) {
      playCardSound(this.shuffeledCardNames[this.currentPlayCard]);
    }
  }
}

export default Play;
