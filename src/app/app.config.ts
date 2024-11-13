import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import {provideAnimations} from '@angular/platform-browser/animations';
import {provideToastr, TOAST_CONFIG, ToastrConfig} from 'ngx-toastr';

export const appConfig: ApplicationConfig = {
  providers: [provideZoneChangeDetection({ eventCoalescing: true }), provideRouter(routes), provideAnimationsAsync(), provideAnimations(), provideToastr({
    positionClass: 'toast-top-center',
    timeOut: 5000,
    closeButton: true,
    progressBar: true,
    tapToDismiss: true,
    maxOpened: 3,
    autoDismiss: true
  } as Partial<ToastrConfig>)]
};
