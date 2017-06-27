import Rx from 'rxjs';
import './UnlockScreen.scss';
import {TweenMax, TimelineMax} from 'gsap';

export default function unlockScreen(el) {
  const unlockScreen = document.createElement('div');
  const slider = document.createElement('div');
  const text = document.createElement('div');
  const box = document.createElement('div');

  unlockScreen.className = 'unlock-screen';
  slider.className = 'slider'
  text.className = 'text';
  text.textContent = 'Slide to unlock...'
  box.className = 'box';

  slider.appendChild(text);
  slider.appendChild(box);
  unlockScreen.appendChild(slider);

  el.appendChild(unlockScreen);

  const mouseUp$ = Rx.Observable.fromEvent(document, 'mouseup');

  const boxClick$ = Rx.Observable
    .fromEvent(box, 'mousedown')
    .do(e => e.preventDefault())
    .map(e => e.pageX)

  const boxMove$ = boxClick$
    .switchMap(pageX => Rx.Observable
      .fromEvent(document, 'mousemove')
      .map((e) => Math.max(0, e.pageX - pageX))
      .takeUntil(mouseUp$)
    );

  const boxRelease$ = boxMove$
    .switchMap(x => mouseUp$
      .take(1)
      .mapTo(x)
    );

  const boxUnlock$ = boxMove$
    .filter(x => x >= 200);

  const boxRestore$ = boxRelease$
    .filter(x => x < 200);

  boxMove$.subscribe(offset => {
    TweenMax.to(text, 0.3, {autoAlpha: 0});
    TweenMax.to(unlockScreen, 0.3, {left: offset/5});
    box.style.left = (offset > 200 ? '200px' : offset + 'px');
    unlockScreen.style.opacity = adjustOpacity(offset);
  });

  boxRestore$.subscribe(() => {
    TweenMax.to(unlockScreen, 0.3, {left: 0});
    TweenMax.to(box, 0.5, {left: '0px', ease: Power4.easeOut});
    TweenMax.to(unlockScreen, 0.5, {opacity: 1});
    TweenMax.to(text, 0.3, {autoAlpha: 1});
  });

  boxUnlock$.subscribe(() => {
    const tl = new TimelineMax();
    tl
      .to([box, slider], 0.3, Object.assign({transform: "scaleX(0)"}, {ease: Power2.easeIn}))
      .to(unlockScreen, 0.3, {transform: "scaleX(0)", opacity: 0, display: 'none', ease: Power2.easeIn}, 0.1);
  });


  function adjustOpacity (offset) {
    let val = Math.max(0, 1 - (0.1 * (offset/200)));
    return val;
  }
}

