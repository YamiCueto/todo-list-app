import { Component, OnInit } from '@angular/core';
import { Todo, TodoService, TodoStatus } from '../../services/todo.service';

@Component({
  selector: 'app-todo-list',
  standalone: false,
  templateUrl: './todo-list.component.html',
  styleUrl: './todo-list.component.css'
})
export class TodoListComponent implements OnInit {
  todos: Todo[] = [];
  selectedTask: Todo | null = null;
  showTaskDetail = false;
  isLoading = false;

  TodoStatus = TodoStatus;

  constructor(private todoService: TodoService) {}

  ngOnInit(): void {
    this.loadTodos();
  }

  private loadTodos(): void {
    this.isLoading = true;
    this.todoService.getTodos().subscribe({
      next: (todos) => {
        this.todos = todos.filter(todo => todo.status !== TodoStatus.DELETED);
        this.isLoading = false;
      },
      error: (error) => {
        this.isLoading = false;
        console.error('Error loading todos:', error);
      }
    });
  }

  onTaskClick(task: Todo): void {
    this.selectedTask = { ...task };
    this.showTaskDetail = true;
  }

  onTaskDetailClose(): void {
    this.showTaskDetail = false;
    this.selectedTask = null;
  }

  onTaskSave(updatedTask: Todo): void {
    const result = this.todoService.updateTodo(updatedTask);
    if (result.success) {
      this.showTaskDetail = false;
      this.selectedTask = null;
    }
  }

  onTaskDelete(taskId: number): void {
    if (confirm('¿Estás seguro de que quieres eliminar esta tarea?')) {
      const result = this.todoService.updateTodoStatus(taskId, TodoStatus.DELETED);
      if (result.success) {
        this.showTaskDetail = false;
        this.selectedTask = null;
      }
    }
  }

  toggleTaskStatus(task: Todo): void {
    const newStatus = task.status === TodoStatus.COMPLETED ? TodoStatus.PENDING : TodoStatus.COMPLETED;
    this.todoService.updateTodoStatus(task.id, newStatus);
  }

  getStatusColor(status: TodoStatus): string {
    switch (status) {
      case TodoStatus.IN_PROGRESS: return '#fd7e14';
      case TodoStatus.COMPLETED: return '#28a745';
      case TodoStatus.SUSPENDED: return '#ffc107';
      default: return '#6c757d';
    }
  }

  getStatusText(status: TodoStatus): string {
    switch (status) {
      case TodoStatus.PENDING: return 'Pendiente por iniciar';
      case TodoStatus.IN_PROGRESS: return 'En progreso';
      case TodoStatus.COMPLETED: return 'Terminada';
      case TodoStatus.SUSPENDED: return 'Suspendida';
      default: return 'Desconocido';
    }
  }

  getStatusIcon(status: TodoStatus): string {
    switch (status) {
      case TodoStatus.PENDING: return 'radio_button_unchecked';
      case TodoStatus.IN_PROGRESS: return 'hourglass_empty';
      case TodoStatus.COMPLETED: return 'check_circle';
      case TodoStatus.SUSPENDED: return 'pause_circle';
      default: return 'help_outline';
    }
  }

  getTasksByStatus(status: TodoStatus): Todo[] {
    return this.todos.filter(todo => todo.status === status);
  }

  getTotalTasks(): number {
    return this.todos.length;
  }

  getCompletedTasks(): number {
    return this.todos.filter(todo => todo.status === TodoStatus.COMPLETED).length;
  }

  getInProgressTasks(): number {
    return this.todos.filter(todo => todo.status === TodoStatus.IN_PROGRESS).length;
  }

  getPendingTasks(): number {
    return this.todos.filter(todo => todo.status === TodoStatus.PENDING).length;
  }
}
