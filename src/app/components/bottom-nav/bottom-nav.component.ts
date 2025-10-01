import { Component, EventEmitter, Output } from '@angular/core';

export interface NavItem {
  id: string;
  label: string;
  icon: string;
}

@Component({
  selector: 'app-bottom-nav',
  standalone: false,
  templateUrl: './bottom-nav.component.html',
  styleUrl: './bottom-nav.component.css'
})
export class BottomNavComponent {
  @Output() tabChanged = new EventEmitter<string>();

  currentTab = 'tasks';

  navItems: NavItem[] = [
    { id: 'tasks', label: 'Tareas', icon: 'checklist' },
    { id: 'calendar', label: 'Calendario', icon: 'calendar_today' },
    { id: 'settings', label: 'Configuración', icon: 'settings' }
  ];

  onTabClick(tabId: string) {
    this.currentTab = tabId;
    this.tabChanged.emit(tabId);
  }
}
