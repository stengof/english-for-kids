import state from '../state';

function importAll(r) {
  return r.keys().map(r);
}

let audioPaths = importAll(require.context('../../assets/audio', false, /\.(mp3|mp4|wav)$/));
audioPaths = audioPaths.map((v) => v.default);
const audioNames = require.context('../../assets/audio', false, /\.(mp3|mp4|wav)$/).keys();

function isProperMode(mode) {
  return mode === 'train' ? 1 : 0;
}

function playSound(cardLink) {
  const audioEl = document.createElement('audio');
  const fileName = `./${cardLink.querySelector('.card-title').textContent}.mp3`;
  const indexPath = audioNames.indexOf(fileName);
  const readyPath = audioPaths[indexPath];
  audioEl.setAttribute('src', readyPath);
  audioEl.play();
}

class Train {
  init() {
    this.clickOnCard();
  }

  clickOnCard() {
    this.cardGroup = document.querySelector('.card-group');
    this.cardLink = document.querySelectorAll('.card-link');
    this.cardReload = Array.from(document.querySelectorAll('.card-reload'));
    this.cardLink.forEach((node) => {
      node.addEventListener('click', (event) => {
        if (this.cardReload.includes(event.target) && isProperMode(state.getItem('mode'))) {
          const clickedCard = event.target.parentNode.parentNode.parentNode.parentNode;
          clickedCard.classList.add('card-link-hover');
          clickedCard.addEventListener('mouseleave', (el) => el.target.classList.remove('card-link-hover'));
        } else if (!node.classList.contains('card-link-hover') && isProperMode(state.getItem('mode'))) {
          playSound(node);
        }
      });
    });
  }
}

export default Train;
