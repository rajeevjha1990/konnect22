import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import {
  provideRouter,
  withPreloading,
  PreloadAllModules,
  RouteReuseStrategy,
} from '@angular/router';

import {
  IonicRouteStrategy,
  provideIonicAngular,
} from '@ionic/angular/standalone';

import { HttpClientModule } from '@angular/common/http';
import { IonicStorageModule } from '@ionic/storage-angular';

import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideIonicAngular(),

    {
      provide: RouteReuseStrategy,
      useClass: IonicRouteStrategy,
    },

    provideRouter(routes, withPreloading(PreloadAllModules)),

    importProvidersFrom(HttpClientModule, IonicStorageModule.forRoot()),
  ],
};
