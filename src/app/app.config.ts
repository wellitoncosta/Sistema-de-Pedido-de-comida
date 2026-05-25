import {
  ApplicationConfig,
  importProvidersFrom
} from '@angular/core';

import {
  provideRouter
} from '@angular/router';

import {
  provideHttpClient,
  HttpClient
} from '@angular/common/http';

import {
  TranslateLoader,
  TranslateModule
} from '@ngx-translate/core';

import {
  TranslateHttpLoader
} from '@ngx-translate/http-loader';

import { routes } from './app.routes';

export function createTranslateLoader(
  http: HttpClient
) {

  return new TranslateHttpLoader(
    http,
    './assets/i18n/',
    '.json'
);
}

export const appConfig: ApplicationConfig = {

  providers: [

    provideRouter(routes),

    provideHttpClient(),

    importProvidersFrom(

      TranslateModule.forRoot({

        defaultLanguage: 'pt',

        loader: {

          provide: TranslateLoader,

          useFactory: createTranslateLoader,

          deps: [HttpClient]
        }
      })
    )
  ]
};