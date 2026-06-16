import { bootstrapApplication } from '@angular/platform-browser';
import 'zone.js';

import { addIcons } from 'ionicons';
import {
  cartOutline,
  searchOutline,
  homeOutline,
  menuOutline,
  personOutline,
  heartOutline,
  bagOutline,
  trashOutline,
  addOutline,
  removeOutline,
  arrowBackOutline,
  apps,
  phonePortrait,
  shirt,
  walk,
  watch,
  flower,
  starOutline,
  heartOutline as heart,
  cubeOutline,
  logOutOutline,
} from 'ionicons/icons';

import { AppComponent } from './app/app.component';
import { appConfig } from './app/app.config';

addIcons({
  'cart-outline': cartOutline,
  'search-outline': searchOutline,
  'home-outline': homeOutline,
  'menu-outline': menuOutline,
  'person-outline': personOutline,
  'heart-outline': heartOutline,
  'bag-outline': bagOutline,
  'trash-outline': trashOutline,
  'add-outline': addOutline,
  'remove-outline': removeOutline,
  'arrow-back-outline': arrowBackOutline,
  'cube-outline': cubeOutline,
  'log-out-outline': logOutOutline,
  heart: heart,
  apps: apps,
  'phone-portrait': phonePortrait,
  shirt: shirt,
  walk: walk,
  watch: watch,
  flower: flower,
  'star-outline': starOutline,
  star: starOutline,
  cube: 'cubeOutline',
  logout: 'logOutOutline',
  'star-half': 'starHalfOutline',
  'eye-outline': 'eyeOutline',
  'eye-off-outline': 'eyeOffOutline',
});

bootstrapApplication(AppComponent, appConfig).catch((err) =>
  console.error(err),
);
