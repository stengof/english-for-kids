import '../../styles/index.scss';
import Markup from '../markup';
import Train from './train';
import Play from './play';

const mark = new Markup();
mark.initCategory();
const train = new Train();
train.init();
const play = new Play();
play.init();
play.getCards(mark.currentPageCardNames);
