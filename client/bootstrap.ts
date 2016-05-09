import { enableProdMode, provide } from 'angular2/core';
import { bootstrap } from 'angular2/platform/browser';
import { HTTP_PROVIDERS } from 'angular2/http';
import { ROUTER_PROVIDERS, LocationStrategy, HashLocationStrategy, APP_BASE_HREF } from 'angular2/router';
import { DemoApp } from './demo-app/demo-app';
import { ToggleStateService } from './services/toggle-state.service';

if (window['IS_PROD'] === 'true') {
  enableProdMode();
}

bootstrap(DemoApp, [
  HTTP_PROVIDERS,
  ROUTER_PROVIDERS,
  ToggleStateService,
  provide(APP_BASE_HREF, {useValue: '/' }),
  provide(LocationStrategy, {useClass: HashLocationStrategy})
]);

