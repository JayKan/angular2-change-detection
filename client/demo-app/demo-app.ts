import { Component, ViewEncapsulation, ViewChild, OnInit, AfterViewChecked, AfterViewInit } from 'angular2/core';
import { ROUTER_DIRECTIVES, RouteConfig, Route } from 'angular2/router';
import { DefaultChangeComponent } from '../components/default-change/default-change';
import { Subject } from 'rxjs/Rx';

@Component({
  selector: 'demo-app',
  directives: [ROUTER_DIRECTIVES],
  moduleId: __moduleName,
  encapsulation: ViewEncapsulation.None,
  templateUrl: 'template.html',
  styleUrls: ['style.css']
})

@RouteConfig([
  new Route({ path: '/default-change', component: DefaultChangeComponent, name: 'DefaultChange', useAsDefault: true })
])

export class DemoApp {

  notifier: Subject<any> = new Subject();
  @ViewChild(DefaultChangeComponent) defaultViewChild: DefaultChangeComponent;

  constructor() {}

  ngOnInit(): void {
    // console.log('## DemoApp ngOnInit()');
  }

  ngAfterViewInit(): void {
    console.log('## DemoApp @VieChild() being set here: ', this.defaultViewChild);
  }
  // ngAfterViewChecked(): void {
  //   console.log('--------- Step1: ngAfterViewChecked() being called from demoApp: ', this.defaultViewChild);
  //   if (this.defaultViewChild) {
  //     this.defaultViewChild.notifier = this.notifier;
  //   }
  // }
}