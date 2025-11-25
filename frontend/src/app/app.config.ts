import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { providePrimeNG } from 'primeng/config';
import { routes } from './app.routes';
import Cora from './theme';
import Dora from './b&wtheme';
import { HTTP_INTERCEPTORS, provideHttpClient, withInterceptors, withInterceptorsFromDi } from '@angular/common/http';
import { AuthInterceptor } from './pages/login/auth.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient(
      withInterceptorsFromDi()
    ),
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    provideAnimationsAsync(),
        providePrimeNG({
          ripple: true,
          theme: {
            preset: Cora,
            options: {
                prefix: 'p',
                darkModeSelector: false,
                cssLayer: {
                  name: 'primeng',
                  order: 'app-styles, primeng, another-css-library'
                }
            }
          },
          
        })
  ]
};
