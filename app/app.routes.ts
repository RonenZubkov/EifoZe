import { PLATFORM_DIRECTIVES } from '@angular/core';
import {AppComponent} from './app.component';
import {MonsterListComponent} from './monster/monster-list.component';
import {MonsterComponent} from './monster/monster.component';
import {MonsterEditComponent} from './monster/monster-edit.component';
<<<<<<< HEAD
// import {ChatRoomComponent} from './chat/chat-room.component';
import { RouterConfig, ROUTER_DIRECTIVES, provideRouter } from '@angular/router';
import {MapComponent} from "./shared/map-component/map.component";



const routes: RouterConfig = [
  { path: '', component: AppComponent },
  { path: 'map', component: MapComponent },
  { path: 'monster', component: MonsterListComponent },
  { path: 'monster/edit', component: MonsterEditComponent },
  { path: 'monster/edit/:id', component: MonsterEditComponent },
  { path: 'monster/:id/:name', component: MonsterComponent }
=======

import {LayerListComponent} from './layer/layer-list.component';
import {LayerComponent} from './layer/layer.component';
import {LayerEditComponent} from './layer/layer-edit.component';
// import {ChatRoomComponent} from './chat/chat-room.component';
import { RouterConfig, ROUTER_DIRECTIVES, provideRouter } from '@angular/router';

const routes: RouterConfig = [
  { path: '', component: AppComponent },
  { path: 'monster', component: MonsterListComponent },
  { path: 'monster/edit', component: MonsterEditComponent },
  { path: 'monster/edit/:id', component: MonsterEditComponent },
  { path: 'monster/:id/:name', component: MonsterComponent }, 
  { path: 'layer', component: LayerListComponent },
  { path: 'layer/edit', component: LayerEditComponent },
  { path: 'layer/edit/:id', component: LayerEditComponent },
  { path: 'layer/:id/:name', component: LayerEditComponent },
>>>>>>> origin/master
  // { path: 'chat', component: ChatRoomComponent }

];

export const ROUTER_PROVIDERS = [
  provideRouter(routes),
  {provide: PLATFORM_DIRECTIVES, useValue: ROUTER_DIRECTIVES, multi: true}
];
