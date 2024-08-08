import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AddTodoComponent } from './add-todo.component';
import { ReactiveFormsModule } from '@angular/forms';
import { TodoService } from '../../services/todo.service';

describe('AddTodoComponent', () => {
  let component: AddTodoComponent;
  let fixture: ComponentFixture<AddTodoComponent>;
  let todoService: TodoService;

  beforeEach(async () => {
    const todoServiceStub = {
      addTodo: jest.fn()
    };

    await TestBed.configureTestingModule({
      declarations: [ AddTodoComponent ],
      imports: [ ReactiveFormsModule ],
      providers: [{ provide: TodoService, useValue: todoServiceStub }]
    }).compileComponents();

    fixture = TestBed.createComponent(AddTodoComponent);
    component = fixture.componentInstance;
    todoService = TestBed.inject(TodoService);
    fixture.detectChanges();
  });

  test('should create', () => {
    expect(component).toBeTruthy();
  });

  test('should have an invalid form when empty', () => {
    expect(component.todoForm.valid).toBeFalsy();
  });

  test('should have a valid form when filled', () => {
    component.todoForm.controls['title'].setValue('Test Todo');
    expect(component.todoForm.valid).toBeTruthy();
  });

  test('should call addTodo on submit', () => {
    jest.spyOn(todoService, 'addTodo');
    component.todoForm.controls['title'].setValue('Test Todo');
    component.addTodo();
    expect(todoService.addTodo).toHaveBeenCalledWith('Test Todo');
    expect(component.todoForm.controls['title'].value).toBe(''); // Asegura que el formulario se restableció correctamente
  });

  test('should not call addTodo if form is invalid', () => {
    jest.spyOn(todoService, 'addTodo');
    component.addTodo();
    expect(todoService.addTodo).not.toHaveBeenCalled();
  });
});
