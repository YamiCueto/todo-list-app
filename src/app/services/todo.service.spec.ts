import { TestBed } from '@angular/core/testing';
import { TodoService, FilterType } from './todo.service';

describe('TodoService', () => {
  let service: TodoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TodoService);
    // Clear localStorage before each test
    localStorage.clear();
  });

  afterEach(() => {
    localStorage.clear();
  });

  test('should be created', () => {
    expect(service).toBeTruthy();
  });

  test('should add a new todo', () => {
    const result = service.addTodo('Test Todo');
    expect(result.success).toBe(true);

    service.getTodos().subscribe((todos) => {
      expect(todos.length).toBe(1);
      expect(todos[0].title).toBe('Test Todo');
      expect(todos[0].completed).toBe(false);
      expect(todos[0].createdAt).toBeDefined();
      expect(todos[0].updatedAt).toBeDefined();
    });
  });

  test('should not add todo with empty title', () => {
    const result = service.addTodo('');
    expect(result.success).toBe(false);
    expect(result.error).toBe('Title is required');
  });

  test('should edit a todo', () => {
    service.addTodo('Test Todo');
    const result = service.editTodo(1, 'Updated Todo');

    expect(result.success).toBe(true);
    service.getTodos().subscribe((todos) => {
      expect(todos[0].title).toBe('Updated Todo');
    });
  });

  test('should not edit a non-existing todo', () => {
    const result = service.editTodo(999, 'Non-Existent Todo');
    expect(result.success).toBe(false);
    expect(result.error).toBe('Todo not found');
  });

  test('should toggle todo completion', () => {
    service.addTodo('Test Todo');
    const result = service.toggleTodoCompletion(1);

    expect(result.success).toBe(true);
    service.getTodos().subscribe((todos) => {
      expect(todos[0].completed).toBe(true);
    });
  });

  test('should not toggle completion of non-existing todo', () => {
    const result = service.toggleTodoCompletion(999);
    expect(result.success).toBe(false);
    expect(result.error).toBe('Todo not found');
  });

  test('should delete a todo', () => {
    service.addTodo('Test Todo');
    const result = service.deleteTodo(1);

    expect(result.success).toBe(true);
    service.getTodos().subscribe((todos) => {
      expect(todos.length).toBe(0);
    });
  });

  test('should not delete a non-existing todo', () => {
    const result = service.deleteTodo(999);
    expect(result.success).toBe(false);
    expect(result.error).toBe('Todo not found');
  });

  test('should filter todos correctly', () => {
    service.addTodo('Active Todo');
    service.addTodo('Completed Todo');
    service.toggleTodoCompletion(2);

    service.getFilteredTodos(FilterType.ACTIVE).subscribe((todos) => {
      expect(todos.length).toBe(1);
      expect(todos[0].completed).toBe(false);
    });

    service.getFilteredTodos(FilterType.COMPLETED).subscribe((todos) => {
      expect(todos.length).toBe(1);
      expect(todos[0].completed).toBe(true);
    });

    service.getFilteredTodos(FilterType.ALL).subscribe((todos) => {
      expect(todos.length).toBe(2);
    });
  });

  test('should get correct counts', () => {
    service.addTodo('Active Todo');
    service.addTodo('Completed Todo');
    service.toggleTodoCompletion(2);

    expect(service.getActiveCount()).toBe(1);
    expect(service.getCompletedCount()).toBe(1);
  });

  test('should clear completed todos', () => {
    service.addTodo('Active Todo');
    service.addTodo('Completed Todo');
    service.toggleTodoCompletion(2);

    const result = service.clearCompleted();
    expect(result.success).toBe(true);

    service.getTodos().subscribe((todos) => {
      expect(todos.length).toBe(1);
      expect(todos[0].completed).toBe(false);
    });
  });

  test('should persist to localStorage', () => {
    service.addTodo('Persistent Todo');

    const stored = localStorage.getItem('todo-list-app-todos');
    expect(stored).toBeTruthy();

    const todos = JSON.parse(stored!);
    expect(todos).toHaveLength(1);
    expect(todos[0].title).toBe('Persistent Todo');
  });
});
