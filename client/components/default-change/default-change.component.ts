import { Component, ViewEncapsulation, ViewChild, OnInit} from 'angular2/core';
import { ComponentOne } from './component-one';
import { Subject } from 'rxjs/Rx';
import { ToggleStateService } from '../../services/toggle-state.service';

@Component({
  selector: 'default-change-demo',
  moduleId: __moduleName,
  encapsulation: ViewEncapsulation.None,
  directives: [ComponentOne],
  template: `
  <h4>Default Change Detection</h4> 
  <p>
    This example shows how change detection is performed for each component after every VM turn. 
    All components should light up when: 
  </p>
  
  <ol class="list">
    <li>The app is bootstrapped (reload browser to double-check)</li>
    <li>The "Trigger" button is clicked</li>
  </ol>
  
  <div>  
    <button (click)="null" type="button" class="btn btn-danger">Trigger Change</button>
  </div>
  
  <div class="tree">
    <ul>
      <li><cmp-one></cmp-one></li>
    </ul>
  </div>  
   
  `,
  styleUrls: ['style.css'],
})

export class DefaultChangeComponent {

  // @ViewChild('checkbox') checkbox;
  notifier: Subject<any>;
  
  constructor(private _toggleStateService: ToggleStateService) {}

  notifyInterval(runInterval): void {
    console.log('####### notifyInterval() being called.....');
    console.log('@@@ runInterval: ', runInterval);
    this._toggleStateService.runInterval = runInterval;
    this.notifier.next(runInterval);
  }
}