import { TweenMax, TimelineMax } from 'gsap';
import CSSPlugin from 'gsap/CSSPlugin';
import Draggable from 'gsap/Draggable';
import './app.scss';
//import SampleContent from './lib/SampleContent.js';
//import UnlockScreen from './lib/UnlockScreen.js';

const app = document.getElementById('app');
const content = document.querySelector('.content');

//SampleContent(content);
//UnlockScreen(app);

const first = document.querySelector('.first');
const second = document.querySelector('.second');
console.log(second);

let el = Draggable.create(first, {
  type: 'xy',
  onDrag: function (e) {
    if (this.hitTest(second, "10%")) {
      TweenMax.to(second, 0.5, {transformOrigin: "50% 50%", scale: 1.3})
    } else {
      TweenMax.to(second, 0.5, {transformOrigin: "50% 50%", scale: 1})
    }
  },
  onDragEnd: function (e) {
    if (this.hitTest(second, "10%")) {
      new TimelineMax()
        .to(first, 1, {transformOrigin: "50% 50%", scale: 0, ease: Power4.easeOut})
        .to(second, 0.5, {transformOrigin: "50% 50%", scale: 1}, "0.3")
    }
  }
})
