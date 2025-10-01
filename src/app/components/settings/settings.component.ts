import { Component } from '@angular/core';

@Component({
  selector: 'app-settings',
  standalone: false,
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.css'
})
export class SettingsComponent {
  isDarkMode = false;
  notifications = true;
  soundEnabled = true;

  userProfile = {
    name: 'Usuario',
    email: 'usuario@ejemplo.com',
    avatar: ''
  };

  toggleDarkMode() {
    this.isDarkMode = !this.isDarkMode;
    // Aquí implementarías la lógica para cambiar el tema
    console.log('Dark mode:', this.isDarkMode);
  }

  toggleNotifications() {
    this.notifications = !this.notifications;
    console.log('Notifications:', this.notifications);
  }

  toggleSound() {
    this.soundEnabled = !this.soundEnabled;
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
