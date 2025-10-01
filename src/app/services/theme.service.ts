import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private isDarkModeSubject = new BehaviorSubject<boolean>(false);
  public isDarkMode$ = this.isDarkModeSubject.asObservable();

  private readonly THEME_KEY = 'todo-app-dark-mode';

  constructor() {
    this.loadThemeFromStorage();
  }

  private loadThemeFromStorage(): void {
    const savedTheme = localStorage.getItem(this.THEME_KEY);
    const isDarkMode = savedTheme === 'true';
    this.setDarkMode(isDarkMode, false); // false = no guardar de nuevo en localStorage
  }

  public toggleDarkMode(): void {
    const newValue = !this.isDarkModeSubject.value;
    this.setDarkMode(newValue, true);
  }

  public setDarkMode(isDarkMode: boolean, saveToStorage: boolean = true): void {
    this.isDarkModeSubject.next(isDarkMode);

    if (saveToStorage) {
      localStorage.setItem(this.THEME_KEY, isDarkMode.toString());
    }

    // Aplicar el tema al documento
    this.applyTheme(isDarkMode);
  }

  public isDarkMode(): boolean {
    return this.isDarkModeSubject.value;
  }

  private applyTheme(isDarkMode: boolean): void {
    const body = document.body;

    if (isDarkMode) {
      body.classList.add('dark-theme');
      body.classList.remove('light-theme');
    } else {
      body.classList.add('light-theme');
      body.classList.remove('dark-theme');
    }

    // Cambiar el color del tema de la barra de estado en móviles
    this.updateMetaThemeColor(isDarkMode);
  }

  private updateMetaThemeColor(isDarkMode: boolean): void {
    const themeColorMeta = document.querySelector('meta[name="theme-color"]');
    const color = isDarkMode ? '#1a1a1a' : '#007bff';

    if (themeColorMeta) {
      themeColorMeta.setAttribute('content', color);
    } else {
      const meta = document.createElement('meta');
      meta.name = 'theme-color';
      meta.content = color;
      document.getElementsByTagName('head')[0].appendChild(meta);
    }
  }
}
