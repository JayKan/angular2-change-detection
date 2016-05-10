import { enableProdMode, provide } from '@angular/core';
import { bootstrap } from '@angular/platform-browser-dynamic';
import { HTTP_PROVIDERS } from '@angular/http';
import { LocationStrategy, HashLocationStrategy, APP_BASE_HREF } from '@angular/common';
import { ROUTER_PROVIDERS } from '@angular/router-deprecated';
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

