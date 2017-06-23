import Rx from 'rxjs';
import './app.scss';

const box = document.getElementById('box');

const mouseUp$ = Rx.Observable.fromEvent(document, 'mouseup')

const boxclick$ = Rx.Observable
  .fromEvent(box, 'mousedown')
  .do(e => e.preventDefault())
  .map(e => e.pageX)
  .switchMap((click) => Rx.Observable
    .fromEvent(document, 'mousemove')
    .map((e) => e.pageX)
    .do(x => box.style.left = x - click + 'px')
    .takeUntil(mouseUp$)
  );

boxclick$
  .switchMap(() => mouseUp$
    .do(() => box.style.left = 0 + 'px')
  )
  .subscribe(() => console.log('up and reset'));

boxclick$.subscribe(x => {
  console.log(x);
});
