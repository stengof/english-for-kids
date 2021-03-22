import cards from '../assets/cards';
import state from './state';

function importAll(r) {
  return r.keys().map(r);
}

const images = importAll(require.context('../assets/cards', false, /\.(png|jpe?g|svg)$/));
const reload = importAll(require.context('../assets/category', false, /\.(png|jpe?g|svg)$/));
const footerImgs = importAll(require.context('../assets/footer', false, /\.(png|jpe?g|svg)$/));

function createElementWithClass(element, cssClass) {
  const el = document.createElement(element);
  el.classList.add(cssClass);
  return el;
}

function makeBurgerBtnFix() {
  const headerContainer = document.querySelector('.header-container');
  const burgerLbl = document.querySelector('.burger-label');
  const sideMenuWrap = document.querySelector('.side-wrap');
  const sideMenu = document.querySelector('.side-menu');
  const burgerBtn = document.querySelector('.burger-btn');
  let burgerLblst = false;

  function addClassIfChecked() {
    headerContainer.classList.add('header-container-flex-end');
    burgerLbl.classList.add('burger-label-fixed');
    burgerBtn.classList.add('burger-btn-transform', 'burger-btn-white');
    sideMenuWrap.classList.add('side-wrap-visible');
    sideMenu.classList.add('translate-side-menu');
  }

  function removeClassIfChecked() {
    headerContainer.classList.remove('header-container-flex-end');
    burgerLbl.classList.remove('burger-label-fixed');
    burgerBtn.classList.remove('burger-btn-transform', 'burger-btn-white');
    sideMenuWrap.classList.remove('side-wrap-visible');
    sideMenu.classList.remove('translate-side-menu');
  }

  document.addEventListener('click', (event) => {
    if (event.target === burgerLbl || event.target === burgerBtn) burgerLblst = !burgerLblst;
    if (burgerLblst) addClassIfChecked();
    else removeClassIfChecked();
    if (burgerLblst && event.target === sideMenuWrap) {
      burgerLblst = !burgerLblst;
      removeClassIfChecked();
    }
  });
}

class Markup {
  constructor() {
    this.currentCategoryPage = +document.location.href.slice(-1);
    this.currentPageCardNames = [];
  }

  initMain() {
    this.createHeader();
    this.makeActiveMainMenuBtn();
    this.createResults();
    this.createMain('index');
    this.createFooter();
    this.appendCreatedElements();
    makeBurgerBtnFix();
    this.changeMode();
  }

  initCategory() {
    this.createHeader();
    this.makeActiveCurrentMenuBtn();
    this.createResults();
    this.createMain('category');
    this.makeButton();
    this.createFooter();
    this.appendCreatedElements();
    makeBurgerBtnFix();
    this.changeMode();
  }

  initStats() {
    this.createHeader();
    this.makeActiveStatsBtn();
    this.createStatsMain();
    this.createFooter();
    this.appendCreatedElements();
    makeBurgerBtnFix();
    this.changeMode();
  }

  createHeader() {
    this.header = createElementWithClass('header', 'header-container');
    const createBurgerMenuBtn = () => {
      this.burgerLbl = createElementWithClass('div', 'burger-label');
      this.burgerCheck = createElementWithClass('input', 'burger-checkbox');
      this.burgerCheck.setAttribute('type', 'checkbox');
      this.burgerBtn = createElementWithClass('span', 'burger-btn');
      this.burgerLbl.append(this.burgerCheck, this.burgerBtn);
    };
    const createToggleBtn = () => {
      this.toggle = createElementWithClass('label', 'switch');
      this.toggleCheck = createElementWithClass('input', 'real-checkbox');
      this.toggleCheck.setAttribute('type', 'checkbox');
      if (state.getItem('mode') === 'train') {
        this.toggleCheck.setAttribute('checked', 'checked');
      } else if (state.getItem('mode') === 'play') {
        this.toggleCheck.removeAttribute('checked');
      }
      this.toggleBtn = createElementWithClass('span', 'toggle-button');
      this.toggle.append(this.toggleCheck, this.toggleBtn);
    };
    const createMenu = () => {
      this.sideMenuWrap = createElementWithClass('div', 'side-wrap');
      this.sideMenu = createElementWithClass('nav', 'side-menu');
      this.mainMenuBtn = createElementWithClass('a', 'menu-list');
      this.mainMenuBtn.setAttribute('href', './index.html');
      this.mainMenuBtn.textContent = 'Main page';
      this.statsBtn = createElementWithClass('a', 'menu-list');
      this.statsBtn.setAttribute('href', './stats.html');
      this.statsBtn.textContent = 'Stats';
      this.sideMenu.append(this.mainMenuBtn);
      cards[0].forEach((title, i) => {
        const el = createElementWithClass('a', 'menu-list');
        el.textContent = title;
        el.setAttribute('href', `./category.html?${i}`);
        this.sideMenu.append(el);
      });
      this.sideMenuWrap.append(this.sideMenu);
      this.sideMenu.append(this.statsBtn);
    };
    createBurgerMenuBtn();
    createToggleBtn();
    createMenu();
    this.header.append(this.burgerLbl, this.toggle, this.sideMenuWrap);
  }

  makeActiveMainMenuBtn() {
    this.mainMenuBtn.classList.add('active');
  }

  makeActiveCurrentMenuBtn() {
    this.sideMenu.childNodes[this.currentCategoryPage + 1].classList.add('active');
  }

  makeActiveStatsBtn() {
    this.statsBtn.classList.add('active');
  }

  createResults() {
    this.results = createElementWithClass('div', 'results');
  }

  createMain(page) {
    this.main = createElementWithClass('main', 'card-group');
    const readyCards = [];
    const makeCard = (imgSrc, titleEn, hrefIndex = '0', titleRu) => {
      const cardLink = createElementWithClass('a', 'card-link');
      const cardInner = createElementWithClass('div', 'card-inner');
      const cardFront = createElementWithClass('div', 'flip-card-front');
      const cardBack = createElementWithClass('div', 'flip-card-back');
      const cardImg = createElementWithClass('img', 'card-img');
      const cardTextFront = createElementWithClass('div', 'card-text');
      const cardTextBack = createElementWithClass('div', 'card-text');
      const cardTitleFront = createElementWithClass('span', 'card-title');
      const cardTitleBack = createElementWithClass('span', 'card-title');
      cardTitleFront.textContent = titleEn;
      cardTitleBack.textContent = titleRu;
      if (page === 'index') {
        cardLink.setAttribute('href', `/category.html?${hrefIndex}`);
        cardTextFront.append(cardTitleFront);
      } else if (page === 'category') {
        cardLink.classList.add('category');
        const cardReload = createElementWithClass('img', 'card-reload');
        cardReload.src = reload;
        cardReload.alt = 'reload';
        cardTextFront.append(cardTitleFront, cardReload);
        cardTextBack.append(cardTitleBack, cardReload.cloneNode(true));
      }
      cardImg.setAttribute('src', imgSrc);
      cardFront.append(cardImg, cardTextFront);
      cardBack.append(cardImg.cloneNode(true), cardTextBack);
      cardInner.append(cardFront, cardBack);
      cardLink.append(cardInner);
      return cardLink;
    };
    if (page === 'index') {
      cards[0].forEach((a, i) => readyCards.push(makeCard(images[i * 8], a, i)));
    } else if (page === 'category') {
      cards[0].forEach((a, i) => {
        this.currentPageCardNames.push(cards[this.currentCategoryPage + 1][i].word);
        readyCards.push(makeCard(images[i + (8 * this.currentCategoryPage)],
          cards[this.currentCategoryPage + 1][i].word,
          null,
          cards[this.currentCategoryPage + 1][i].translation));
      });
    }
    readyCards.forEach((a) => this.main.append(a));
  }

  makeButton() {
    this.gameButton = createElementWithClass('button', 'game-button');
    this.gameButton.textContent = 'Start game';
  }

  createFooter() {
    this.footer = createElementWithClass('footer', 'footer');
    this.footerGitHubLink = createElementWithClass('a', 'github-link');
    this.footerGitHubImg = createElementWithClass('img', 'github-img');
    this.footerRsSchoolLink = createElementWithClass('a', 'rs-school-link');
    this.footerRsSchoolImg = createElementWithClass('img', 'rs-school-img');
    this.footerGitHubImg.setAttribute('src', footerImgs[0]);
    this.footerRsSchoolImg.setAttribute('src', footerImgs[1]);
    this.footerGitHubLink.setAttribute('href', 'https://github.com/stengof');
    this.footerRsSchoolLink.setAttribute('href', 'https://rs.school/js/');
    this.footerGitHubLink.append(this.footerGitHubImg);
    this.footerRsSchoolLink.append(this.footerRsSchoolImg);
    this.footerText = createElementWithClass('p', 'footer-text');
    this.footerText.textContent = '2020';
    this.footer.append(this.footerGitHubLink, this.footerText, this.footerRsSchoolLink);
  }

  appendCreatedElements() {
    const elements = [this.header, this.results, this.main, this.statsCont,
      this.gameButton, this.footer,
    ];
    elements.forEach((el) => {
      if (el) document.body.append(el);
    });
  }

  changeMode() {
    this.toggleCheck.addEventListener('change', () => {
      if (state.getItem('mode') === 'train') {
        document.body.classList.add('play');
        state.setItem('mode', 'play');
      } else if (state.getItem('mode') === 'play') {
        document.body.classList.remove('play');
        state.setItem('mode', 'train');
      }
    });
  }

  createStatsMain() {
    const createTable = () => {
      this.statsCont = createElementWithClass('div', 'stats');
      this.table = createElementWithClass('table', 'table');
      this.tableRow = createElementWithClass('tr', 'stats-row');
      this.tableHeadingRow = createElementWithClass('tr', 'stats-heading-row');
      this.tableHeading = createElementWithClass('th', 'stats-heading');
      this.tableHeadingNames = ['Category', 'Word', 'Translation', 'Train', 'Corr.', 'Incorr.', '%'];
      this.tableCell = createElementWithClass('td', 'stats-cell');
      this.tableHeadingNames.forEach((name) => {
        const node = this.tableHeading.cloneNode();
        node.textContent = name;
        this.tableHeadingRow.append(node);
      });
      this.statsCont.append(this.table);
      this.table.append(this.tableHeadingRow);
    };
    const createEachRowInTable = () => {
      cards.forEach((category, i) => {
        category.forEach((cardsObj) => {
          if (i > 0) {
            const currentRow = this.tableRow.cloneNode();
            const cellCategoryName = this.tableCell.cloneNode();
            const cellWord = this.tableCell.cloneNode();
            const cellTrans = this.tableCell.cloneNode();
            const cellTrain = this.tableCell.cloneNode();
            const cellCorr = this.tableCell.cloneNode();
            const cellIncorr = this.tableCell.cloneNode();
            const cellPercent = this.tableCell.cloneNode();
            cellCategoryName.textContent = cards[0][i - 1];
            cellWord.textContent = cardsObj.word;
            cellTrans.textContent = cardsObj.translation;
            cellTrain.textContent = '0';
            cellCorr.textContent = '0';
            cellIncorr.textContent = '0';
            cellPercent.textContent = '0';
            currentRow.append(cellCategoryName, cellWord, cellTrans,
              cellTrain, cellCorr, cellIncorr, cellPercent);
            this.table.append(currentRow);
          }
        });
      });
    };
    createTable();
    createEachRowInTable();
  }
}

export default Markup;
