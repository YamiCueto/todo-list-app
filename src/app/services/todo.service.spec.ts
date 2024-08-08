import { TestBed } from '@angular/core/testing';
import { TodoService } from './todo.service';

describe('TodoService', () => {
  let service: TodoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TodoService);
  });

  test('should be created', () => {
    expect(service).toBeTruthy();
  });

  test('should add a new todo', () => {
    service.addTodo('Test Todo');
    service.getTodos().subscribe((todos) => {
      expect(todos.length).toBe(1);
      expect(todos[0].title).toBe('Test Todo');
      expect(todos[0].completed).toBe(false);
    });
  });

  test('should edit a todo', () => {
    service.addTodo('Test Todo');
    service.editTodo(1, 'Updated Todo');
    service.getTodos().subscribe((todos) => {
      expect(todos[0].title).toBe('Updated Todo');
    });
  });

  test('should not edit a non-existing todo', () => {
    service.editTodo(999, 'Non-Existent Todo');
    service.getTodos().subscribe((todos) => {
      expect(todos.length).toBe(0);
    });
  });

  test('should toggle todo completion', () => {
    service.addTodo('Test Todo');
    service.toggleTodoCompletion(1);
    service.getTodos().subscribe((todos) => {
      expect(todos[0].completed).toBe(true);
    });
  });

  test('should not toggle completion of non-existing todo', () => {
    service.toggleTodoCompletion(999);
    service.getTodos().subscribe((todos) => {
      expect(todos.length).toBe(0);
    });
  });

  test('should delete a todo', () => {
    service.addTodo('Test Todo');
    service.deleteTodo(1);
    service.getTodos().subscribe((todos) => {
      expect(todos.length).toBe(0);
    });
  });

  test('should not delete a non-existing todo', () => {
    service.deleteTodo(999);
    service.getTodos().subscribe((todos) => {
      expect(todos.length).toBe(0);
    });
  });
});
