import { Component } from '@angular/core';

import { RouterOutlet } from '@angular/router';

import {
  TranslateService
} from '@ngx-translate/core';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.html'
})
export class App {

  constructor(
    private translate: TranslateService
  ){

    this.translate.addLangs([
      'pt',
      'en'
    ]);

    this.translate.setDefaultLang('pt');

    const idiomaSalvo =
      localStorage.getItem('lang');

    this.translate.use(
      idiomaSalvo || 'pt'
    );
  }
}