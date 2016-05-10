import { Component, AfterViewChecked, ViewEncapsulation, NgZone, ElementRef } from '@angular/core';
import { toggleClass } from '../../services/toggle-class.service';

@Component({
  selector: 'cmp-six',
  encapsulation: ViewEncapsulation.None,
  template: `
  <a>CMP 6</a>
  `
})
export class ComponentSix implements AfterViewChecked {
  constructor(private _zone: NgZone, private _el: ElementRef) {}
  
  ngAfterViewChecked(): void {
    console.log('###### Component 6 ngAfterViewChecked() ....');
    toggleClass(this._el, this._zone);
  }
}