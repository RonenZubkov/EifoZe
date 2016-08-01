import { provide } from '@angular/core';
import { bootstrap }    from '@angular/platform-browser-dynamic';
import { LocationStrategy, PathLocationStrategy } from '@angular/common';
import { provideForms } from '@angular/forms';
import { HTTP_PROVIDERS } from '@angular/http';
import { ROUTER_PROVIDERS } from './app.routes';

import { AppComponent } from './app.component';

import {MapsAPILoader, NoOpMapsAPILoader, MouseEvent, GOOGLE_MAPS_PROVIDERS, GOOGLE_MAPS_DIRECTIVES,provideLazyMapsAPILoaderConfig} from 'angular2-google-maps/core';




bootstrap(AppComponent, [
  provideForms(),
  ROUTER_PROVIDERS,
  HTTP_PROVIDERS,
  GOOGLE_MAPS_PROVIDERS,
  provideLazyMapsAPILoaderConfig({
    apiKey: 'AIzaSyAp25hDuzLA_wfR-apZEOUWOTkdRlalRJM',
    libraries: ['places'] }),
  provide(LocationStrategy, { useClass: PathLocationStrategy })
]);

