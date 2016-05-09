import { Component, AfterViewChecked, ViewEncapsulation, NgZone, ElementRef } from 'angular2/core';
import { ComponentFour } from './component-four';
import { ComponentFive } from './component-five';
import { toggleClass } from '../../services/toggle-class.service';

@Component({
  selector: 'cmp-two',
  encapsulation: ViewEncapsulation.None,
  directives: [ComponentFour, ComponentFive],
  template: `
  <a>Cmp 2</a>
  
  <ul>
    <li><cmp-four></cmp-four></li>
    <li><cmp-five></cmp-five></li>
  </ul>
  `,
})
export class ComponentTwo implements AfterViewChecked {
  constructor(private _zone: NgZone, private _el: ElementRef) {}
  
  ngAfterViewChecked(): void {
    console.log('###### Component 2 ngAfterViewChecked() ....');
    toggleClass(this._el, this._zone);
  }
}