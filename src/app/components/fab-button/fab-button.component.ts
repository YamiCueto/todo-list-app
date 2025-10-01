import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-fab-button',
  standalone: false,
  templateUrl: './fab-button.component.html',
  styleUrl: './fab-button.component.css'
})
export class FabButtonComponent {
  @Output() click = new EventEmitter<void>();

  onClick() {
    this.click.emit();
  }
}
