import { ElementRef, NgZone } from 'angular2/core';

export function toggleClass(el: ElementRef, zone: NgZone, className:string = 'checked') {
  let a = el.nativeElement.querySelector('a');
  // console.log('Element: ', a);
  a.classList.add(className);
  zone.runOutsideAngular(() => {
    setTimeout(() => {
      a.classList.remove(className);
      // console.log('--------- Step3: runOutsideAngular: ', a);
    }, 1500);
  })
}