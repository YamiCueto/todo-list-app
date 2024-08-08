import { TestBed } from '@angular/core/testing';
import { TodoService } from './todo.service';

describe('TodoService', () => {
  let service: TodoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TodoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should add a new todo', () => {
    service.addTodo('Test Todo');
    service.getTodos().subscribe(todos => {
      expect(todos.length).toBe(1);
      expect(todos[0].title).toBe('Test Todo');
    });
  });

  it('should edit a todo', () => {
    service.addTodo('Test Todo');
    service.editTodo(1, 'Updated Todo');
    service.getTodos().subscribe(todos => {
      expect(todos[0].title).toBe('Updated Todo');
    });
  });

  it('should toggle todo completion', () => {
    service.addTodo('Test Todo');
    service.toggleTodoCompletion(1);
    service.getTodos().subscribe(todos => {
      expect(todos[0].completed).toBe(true);
    });
  });

  it('should delete a todo', () => {
    service.addTodo('Test Todo');
    service.deleteTodo(1);
    service.getTodos().subscribe(todos => {
      expect(todos.length).toBe(0);
    });
  });
});
