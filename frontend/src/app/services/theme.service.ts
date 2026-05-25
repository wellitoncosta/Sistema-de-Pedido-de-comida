import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private isDarkMode = true;

  constructor() {
    // Ao iniciar, verifica se o utilizador já tinha escolhido um modo antes
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'light') {
      this.setLightMode();
    } else {
      this.setDarkMode();
    }
  }

  getDarkModeStatus() {
    return this.isDarkMode;
  }

  toggleTheme() {
    if (this.isDarkMode) {
      this.setLightMode();
    } else {
      this.setDarkMode();
    }
  }

  private setLightMode() {
    this.isDarkMode = false;
    document.body.classList.add('light-mode');
    localStorage.setItem('theme', 'light');
  }

  private setDarkMode() {
    this.isDarkMode = true;
    document.body.classList.remove('light-mode');
    localStorage.setItem('theme', 'dark');
  }
}