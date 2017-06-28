'use strict';

import {Observable} from 'rxjs/Observable';
import 'rxjs/add/observable/fromEvent';
import 'rxjs/add/observable/merge';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/mapTo';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/take';
import 'rxjs/add/operator/takeUntil';

import './UnlockScreen.scss';
import {TweenMax, TimelineMax} from 'gsap';

export default function UnlockScreen () {
  const unlockScreen = document.querySelector('.unlock-screen');
  const slider = document.querySelector('.slider');
  const text = document.querySelector('.text');
  const box = document.querySelector('.box');

  const mouseUp$ = Observable.merge(
    Observable.fromEvent(document, 'mouseup'),
    Observable.fromEvent(document, 'touchend')
  );

  const boxClick$ = Observable.merge(
      Observable.fromEvent(box, 'mousedown'),
      Observable.fromEvent(box, 'touchstart')
    )
    .do(e => e.preventDefault())
    .map(e => (e.type == 'mousedown') ? e.pageX : e.touches[0].pageX);

  const boxMove$ = boxClick$
    .switchMap(pageX => Observable.merge(
        Observable.fromEvent(document, 'mousemove'),
        Observable.fromEvent(document, 'touchmove')
      )
      .map(e => (e.type == 'mousemove') ? e : e.touches[0])
      .map(e => Math.max(0, e.pageX - pageX))
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
