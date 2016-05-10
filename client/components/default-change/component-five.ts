import { Component, AfterViewChecked, ViewEncapsulation, NgZone, ElementRef } from '@angular/core';
import { toggleClass } from '../../services/toggle-class.service';

@Component({
  selector: 'cmp-five',
  encapsulation: ViewEncapsulation.None,
  template: `
  <a>CMP 5</a>
  `
})
export class ComponentFive implements AfterViewChecked {
  constructor(private _zone: NgZone, private _el: ElementRef) {}
  
  ngAfterViewChecked(): void {
    console.log('###### Component 5 ngAfterViewChecked() ....');
    toggleClass(this._el, this._zone);
  }
}