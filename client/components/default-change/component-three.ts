import { Component, AfterViewChecked, ViewEncapsulation, NgZone, ElementRef } from '@angular/core';
import { ComponentSix } from './component-six';
import { ComponentSeven } from './component-seven';
import { toggleClass } from '../../services/toggle-class.service';

@Component({
  selector: 'cmp-three',
  encapsulation: ViewEncapsulation.None,
  directives: [ComponentSix, ComponentSeven],
  template: `
  <a>Cmp 3</a>
  <ul>
    <li><cmp-six></cmp-six></li>
    <li><cmp-seven></cmp-seven></li>
  </ul>
  `
})
export class ComponentThree implements AfterViewChecked {
  constructor(private _zone: NgZone, private _el: ElementRef) {}

  ngAfterViewChecked(): void {
    console.log('###### Component 3 ngAfterViewChecked() ....');
    toggleClass(this._el, this._zone);
  }
}