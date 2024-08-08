import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Todo } from '../../services/todo.service';

@Component({
  selector: 'app-todo-item',
  templateUrl: './todo-item.component.html',
  styleUrl: './todo-item.component.css'
})
export class TodoItemComponent {
  @Input() todo!: Todo;
  @Output() delete = new EventEmitter<number>();
  @Output() toggle = new EventEmitter<number>();

  deleteTodo(): void {
    this.delete.emit(this.todo.id);
  }

  toggleCompletion(): void {
    this.toggle.emit(this.todo.id);
  }
}
