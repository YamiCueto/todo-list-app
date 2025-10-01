import { Component, EventEmitter, Output, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TodoService } from '../../services/todo.service';

@Component({
  selector: 'app-add-todo',
  standalone: false,
  templateUrl: './add-todo.component.html',
  styleUrl: './add-todo.component.css'
})
export class AddTodoComponent {
  @Input() isModal = false;
  @Output() close = new EventEmitter<void>();
  todoForm: FormGroup;
  @Output() error = new EventEmitter<string>();
  isSubmitting = false;

  constructor(private fb: FormBuilder, private todoService: TodoService) {
    this.todoForm = this.fb.group({
      title: ['', [
        Validators.required,
        Validators.minLength(1),
        Validators.maxLength(100),
        this.noWhitespaceValidator
      ]]
    });
  }

  private noWhitespaceValidator(control: any) {
    if (control.value && control.value.trim().length === 0) {
      return { whitespace: true };
    }
    return null;
  }

  addTodo(): void {
    if (this.todoForm.valid && !this.isSubmitting) {
      this.isSubmitting = true;
      const title = this.todoForm.value.title;

      const result = this.todoService.addTodo(title);

      if (result.success) {
        this.todoForm.reset();
        this.error.emit(''); // Clear any previous errors
      } else {
        this.error.emit(result.error || 'Failed to add todo');
      }

      this.isSubmitting = false;
    }
  }

  getErrorMessage(): string {
    const titleControl = this.todoForm.get('title');
    if (titleControl?.hasError('required')) {
      return 'Title is required';
    }
    if (titleControl?.hasError('minlength')) {
      return 'Title must be at least 1 character';
    }
    if (titleControl?.hasError('maxlength')) {
      return 'Title must be less than 100 characters';
    }
    if (titleControl?.hasError('whitespace')) {
      return 'Title cannot be only whitespace';
    }
    return '';
  }

  clearForm(): void {
    this.todoForm.reset();
    this.error.emit('');
  }

}
