import { Component, ViewEncapsulation, AfterViewChecked, NgZone, ElementRef } from 'angular2/core';
import { ComponentTwo } from './component-two';
import { ComponentThree } from './component-three';
import { toggleClass } from '../../services/toggle-class.service';

@Component({
  selector: 'cmp-one',
  encapsulation: ViewEncapsulation.None,
  directives: [ComponentTwo, ComponentThree],
  template:`
  <a>Cmp 1</a>
  
  <ul>
    <li><cmp-two></cmp-two></li>
    <li><cmp-three></cmp-three></li>    
  </ul>
  `
})

export class ComponentOne implements AfterViewChecked {
  constructor(private _zone: NgZone, private _el: ElementRef) {}
  
  ngAfterViewChecked(): void {
    console.log('###### Component 1 ngAfterViewChecked() ....');
    toggleClass(this._el, this._zone);
  }
}