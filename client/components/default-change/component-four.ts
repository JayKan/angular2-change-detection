import { Component, AfterViewChecked, ViewEncapsulation, NgZone, ElementRef } from '@angular/core';
import { toggleClass } from '../../services/toggle-class.service';

@Component({
  selector: 'cmp-four',
  encapsulation: ViewEncapsulation.None,
  template: `
  <a>CMP 4</a>
  `
})
export class ComponentFour implements AfterViewChecked {
  constructor(private _zone: NgZone, private _el: ElementRef) {}

  ngAfterViewChecked(): void {
    console.log('###### Component 4 ngAfterViewChecked() ....');
    toggleClass(this._el, this._zone);
  }
}