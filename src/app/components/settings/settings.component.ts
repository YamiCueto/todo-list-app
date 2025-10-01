import { Component, OnInit, OnDestroy } from '@angular/core';
import { ThemeService } from '../../services/theme.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-settings',
  standalone: false,
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.css'
})
export class SettingsComponent implements OnInit, OnDestroy {
  isDarkMode = false;
  notifications = true;
  soundEnabled = true;
  private themeSubscription: Subscription = new Subscription();

  userProfile = {
    name: 'Usuario',
    email: 'usuario@ejemplo.com',
    avatar: ''
  };

  constructor(private themeService: ThemeService) {}

  ngOnInit(): void {
    // Suscribirse a los cambios del tema
    this.themeSubscription = this.themeService.isDarkMode$.subscribe(isDark => {
      this.isDarkMode = isDark;
    });

    // Cargar configuraciones guardadas
    this.loadSettings();
  }

  ngOnDestroy(): void {
    this.themeSubscription.unsubscribe();
  }

  private loadSettings(): void {
    // Cargar configuración de notificaciones
    const savedNotifications = localStorage.getItem('todo-app-notifications');
    this.notifications = savedNotifications === null ? true : savedNotifications === 'true';

    // Cargar configuración de sonido
    const savedSound = localStorage.getItem('todo-app-sound');
    this.soundEnabled = savedSound === null ? true : savedSound === 'true';
  }

  toggleDarkMode() {
    this.themeService.toggleDarkMode();
    console.log('Dark mode toggled:', this.isDarkMode);
  }

  toggleNotifications() {
    this.notifications = !this.notifications;
    localStorage.setItem('todo-app-notifications', this.notifications.toString());
    console.log('Notifications:', this.notifications);
  }

  toggleSound() {
    this.soundEnabled = !this.soundEnabled;
    localStorage.setItem('todo-app-sound', this.soundEnabled.toString());
    console.log('Sound:', this.soundEnabled);
  }

  exportData() {
    // Implementar exportación de datos
    console.log('Exporting data...');
  }

  importData() {
    // Implementar importación de datos
    console.log('Importing data...');
  }

  clearAllData() {
    if (confirm('¿Estás seguro de que quieres eliminar todos los datos? Esta acción no se puede deshacer.')) {
      localStorage.clear();
      console.log('All data cleared');
    }
  }
}
