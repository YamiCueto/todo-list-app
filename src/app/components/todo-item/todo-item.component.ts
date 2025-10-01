import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Todo } from '../../services/todo.service';

@Component({
  selector: 'app-todo-item',
  standalone: false,
  templateUrl: './todo-item.component.html',
  styleUrl: './todo-item.component.css'
})
export class TodoItemComponent {
  @Input() todo!: Todo;
  @Output() delete = new EventEmitter<number>();
  @Output() toggle = new EventEmitter<number>();
  @Output() edit = new EventEmitter<{id: number, title: string}>();

  isEditing = false;
  editTitle = '';

  deleteTodo(): void {
    this.delete.emit(this.todo.id);
  }

  toggleCompletion(): void {
    this.toggle.emit(this.todo.id);
  }

  startEdit(): void {
    this.isEditing = true;
    this.editTitle = this.todo.title;
  }

  cancelEdit(): void {
    this.isEditing = false;
    this.editTitle = '';
  }

  saveEdit(): void {
    if (this.editTitle.trim().length > 0 && this.editTitle.trim() !== this.todo.title) {
      this.edit.emit({ id: this.todo.id, title: this.editTitle.trim() });
    }
    this.isEditing = false;
  }

  onKeyPress(event: KeyboardEvent): void {
    if (event.key === 'Enter') {
      this.saveEdit();
    } else if (event.key === 'Escape') {
      this.cancelEdit();
    }
  }
}
