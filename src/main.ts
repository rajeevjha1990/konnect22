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
  checkmarkCircle,
  cashOutline,
  cardOutline,
  locationOutline,
  receiptOutline,
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
  'checkmark-circle': checkmarkCircle,
  'phone-portrait-outline': phonePortrait,
  'cash-outline': cashOutline,
  'card-outline': cardOutline,
  'location-outline': locationOutline,
  'receipt-outline': receiptOutline,
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
  'create-outline': 'createOutline',
  'call-outline': 'callOutlien',
});

bootstrapApplication(AppComponent, appConfig).catch((err) =>
  console.error(err),
);
