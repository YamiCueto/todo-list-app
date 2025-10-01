import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export enum TodoStatus {
  PENDING = 'pending',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  SUSPENDED = 'suspended',
  DELETED = 'deleted'
}

export interface Todo {
  id: number;
  title: string;
  description?: string;
  completed: boolean;
  status: TodoStatus;
  createdAt: Date;
  updatedAt: Date;
  dueDate?: Date;
}

export enum FilterType {
  ALL = 'all',
  ACTIVE = 'active',
  COMPLETED = 'completed'
}

@Injectable({
  providedIn: 'root'
})
export class TodoService {
  private todosSubject: BehaviorSubject<Todo[]> = new BehaviorSubject<Todo[]>([]);
  private todos: Todo[] = [];
  private nextId = 1;
  private readonly STORAGE_KEY = 'todo-list-app-todos';

  constructor() {
    this.loadTodosFromStorage();
  }

  private loadTodosFromStorage(): void {
    try {
      const storedTodos = localStorage.getItem(this.STORAGE_KEY);
      if (storedTodos) {
        this.todos = JSON.parse(storedTodos).map((todo: any) => ({
          ...todo,
          createdAt: new Date(todo.createdAt),
          updatedAt: new Date(todo.updatedAt)
        }));

        // Actualizar nextId basado en los todos existentes
        if (this.todos.length > 0) {
          this.nextId = Math.max(...this.todos.map(t => t.id)) + 1;
        }

        this.todosSubject.next(this.todos);
      }
    } catch (error) {
      console.error('Error loading todos from storage:', error);
      this.todos = [];
      this.todosSubject.next(this.todos);
    }
  }

  private saveTodosToStorage(): void {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.todos));
    } catch (error) {
      console.error('Error saving todos to storage:', error);
    }
  }

  getTodos(): Observable<Todo[]> {
    return this.todosSubject.asObservable();
  }

  getFilteredTodos(filter: FilterType): Observable<Todo[]> {
    return new Observable(observer => {
      this.todosSubject.subscribe(todos => {
        let filteredTodos = todos;
        switch (filter) {
          case FilterType.ACTIVE:
            filteredTodos = todos.filter(todo => !todo.completed);
            break;
          case FilterType.COMPLETED:
            filteredTodos = todos.filter(todo => todo.completed);
            break;
          default:
            filteredTodos = todos;
        }
        observer.next(filteredTodos);
      });
    });
  }

  addTodo(title: string, description?: string, dueDate?: Date): { success: boolean; error?: string } {
    try {
      if (!title || title.trim().length === 0) {
        return { success: false, error: 'Title is required' };
      }

      if (title.trim().length > 100) {
        return { success: false, error: 'Title must be less than 100 characters' };
      }

      const now = new Date();
      const newTodo: Todo = {
        id: this.nextId++,
        title: title.trim(),
        description: description || '',
        completed: false,
        status: TodoStatus.PENDING,
        createdAt: now,
        updatedAt: now,
        dueDate: dueDate
      };

      this.todos.push(newTodo);
      this.saveTodosToStorage();
      this.todosSubject.next(this.todos);
      return { success: true };
    } catch (error) {
      return { success: false, error: 'Failed to add todo' };
    }
  }

  editTodo(id: number, title: string, description?: string): { success: boolean; error?: string } {
    try {
      if (!title || title.trim().length === 0) {
        return { success: false, error: 'Title is required' };
      }

      if (title.trim().length > 100) {
        return { success: false, error: 'Title must be less than 100 characters' };
      }

      const todo = this.todos.find(t => t.id === id);
      if (!todo) {
        return { success: false, error: 'Todo not found' };
      }

      todo.title = title.trim();
      if (description !== undefined) {
        todo.description = description.trim();
      }
      todo.updatedAt = new Date();
      this.saveTodosToStorage();
      this.todosSubject.next(this.todos);
      return { success: true };
    } catch (error) {
      return { success: false, error: 'Failed to edit todo' };
    }
  }

  updateTodoStatus(id: number, status: TodoStatus): { success: boolean; error?: string } {
    try {
      const todo = this.todos.find(t => t.id === id);
      if (!todo) {
        return { success: false, error: 'Todo not found' };
      }

      todo.status = status;
      todo.completed = status === TodoStatus.COMPLETED;
      todo.updatedAt = new Date();
      this.saveTodosToStorage();
      this.todosSubject.next(this.todos);
      return { success: true };
    } catch (error) {
      return { success: false, error: 'Failed to update todo status' };
    }
  }

  updateTodo(updatedTodo: Todo): { success: boolean; error?: string } {
    try {
      const index = this.todos.findIndex(t => t.id === updatedTodo.id);
      if (index === -1) {
        return { success: false, error: 'Todo not found' };
      }

      this.todos[index] = { ...updatedTodo, updatedAt: new Date() };
      this.saveTodosToStorage();
      this.todosSubject.next(this.todos);
      return { success: true };
    } catch (error) {
      return { success: false, error: 'Failed to update todo' };
    }
  }

  toggleTodoCompletion(id: number): { success: boolean; error?: string } {
    try {
      const todo = this.todos.find(t => t.id === id);
      if (!todo) {
        return { success: false, error: 'Todo not found' };
      }

      todo.completed = !todo.completed;
      todo.updatedAt = new Date();
      this.saveTodosToStorage();
      this.todosSubject.next(this.todos);
      return { success: true };
    } catch (error) {
      return { success: false, error: 'Failed to toggle todo completion' };
    }
  }

  deleteTodo(id: number): { success: boolean; error?: string } {
    try {
      const initialLength = this.todos.length;
      this.todos = this.todos.filter(t => t.id !== id);

      if (this.todos.length === initialLength) {
        return { success: false, error: 'Todo not found' };
      }

      this.saveTodosToStorage();
      this.todosSubject.next(this.todos);
      return { success: true };
    } catch (error) {
      return { success: false, error: 'Failed to delete todo' };
    }
  }

  getTodoById(id: number): Todo | undefined {
    return this.todos.find(t => t.id === id);
  }

  getCompletedCount(): number {
    return this.todos.filter(t => t.completed).length;
  }

  getActiveCount(): number {
    return this.todos.filter(t => !t.completed).length;
  }

  clearCompleted(): { success: boolean; error?: string } {
    try {
      this.todos = this.todos.filter(t => !t.completed);
      this.saveTodosToStorage();
      this.todosSubject.next(this.todos);
      return { success: true };
    } catch (error) {
      return { success: false, error: 'Failed to clear completed todos' };
    }
  }
}
