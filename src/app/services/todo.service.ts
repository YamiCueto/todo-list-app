import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface Todo {
  id: number;
  title: string;
  completed: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class TodoService {
  private todosSubject: BehaviorSubject<Todo[]> = new BehaviorSubject<Todo[]>([]);
  private todos: Todo[] = [];
  private nextId = 1;

  constructor() { }

  getTodos(): Observable<Todo[]> {
    return this.todosSubject.asObservable();
  }

  addTodo(title: string): void {
    const newTodo: Todo = { id: this.nextId++, title, completed: false };
    this.todos.push(newTodo);
    this.todosSubject.next(this.todos);
  }

  editTodo(id: number, title: string): void {
    const todo = this.todos.find(t => t.id === id);
    if (todo) {
      todo.title = title;
      this.todosSubject.next(this.todos);
    }
  }

  toggleTodoCompletion(id: number): void {
    const todo = this.todos.find(t => t.id === id);
    if (todo) {
      todo.completed = !todo.completed;
      this.todosSubject.next(this.todos);
    }
  }

  deleteTodo(id: number): void {
    this.todos = this.todos.filter(t => t.id !== id);
    this.todosSubject.next(this.todos);
  }
}
