import Rx from 'rxjs';
import './animation.scss'

const btn = document.getElementById('btn');
const btnclick$ = Rx.Observable
  .fromEvent(btn, 'click')

function logger () {
  console.log(Rx);
}

export default logger;
