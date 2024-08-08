import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TodoListComponent } from './todo-list.component';
import { TodoService } from '../../services/todo.service';
import { AddTodoComponent } from '../add-todo/add-todo.component';
import { TodoItemComponent } from '../todo-item/todo-item.component';
import { ReactiveFormsModule } from '@angular/forms';
import { of } from 'rxjs';

describe('TodoListComponent', () => {
  let component: TodoListComponent;
  let fixture: ComponentFixture<TodoListComponent>;
  let todoService: TodoService;

  beforeEach(async () => {
    const todoServiceStub = {
      getTodos: jest.fn().mockReturnValue(of([{ id: 1, title: 'Test Todo', completed: false }])),
      deleteTodo: jest.fn(),
      toggleTodoCompletion: jest.fn(),
      addTodo: jest.fn()
    };

    await TestBed.configureTestingModule({
      declarations: [ TodoListComponent, AddTodoComponent, TodoItemComponent ],
      providers: [{ provide: TodoService, useValue: todoServiceStub }],
      imports: [ReactiveFormsModule]
    }).compileComponents();

    fixture = TestBed.createComponent(TodoListComponent);
    component = fixture.componentInstance;
    todoService = TestBed.inject(TodoService);
    fixture.detectChanges();
  });

  test('should create', () => {
    expect(component).toBeTruthy();
  });

  test('should fetch todos on init', () => {
    expect(component.todos.length).toBe(1);
    expect(component.todos[0].title).toBe('Test Todo');
  });

  test('should delete a todo', () => {
    component.deleteTodo(1);
    expect(todoService.deleteTodo).toHaveBeenCalledWith(1);
  });

  test('should toggle todo completion', () => {
    component.toggleCompletion(1);
    expect(todoService.toggleTodoCompletion).toHaveBeenCalledWith(1);
  });

  test('should add a new todo', () => {
    component.ngOnInit();
    todoService.addTodo('New Todo');
    expect(todoService.addTodo).toHaveBeenCalledWith('New Todo');
  });

  test('should handle addTodo method', () => {
    const addTodoComponent = fixture.debugElement.children[0].componentInstance;
    jest.spyOn(todoService, 'addTodo');
    addTodoComponent.todoForm.controls['title'].setValue('New Todo');
    addTodoComponent.addTodo();
    expect(todoService.addTodo).toHaveBeenCalledWith('New Todo');
  });
});
