import { Component, AfterViewChecked, ViewEncapsulation, NgZone, ElementRef } from '@angular/core';
import { toggleClass } from '../../services/toggle-class.service';

@Component({
  selector: 'cmp-seven',
  encapsulation: ViewEncapsulation.None,
  template: `
  <a>CMP 7</a>
  `
})
export class ComponentSeven implements AfterViewChecked {
  constructor(private _zone: NgZone, private _el: ElementRef) {}

  ngAfterViewChecked(): void {
    console.log('###### Component 7 ngAfterViewChecked() ....');
    toggleClass(this._el, this._zone);
  }
}