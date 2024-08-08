import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AddTodoComponent } from './add-todo.component';
import { ReactiveFormsModule } from '@angular/forms';
import { TodoService } from '../../services/todo.service';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { By } from '@angular/platform-browser';

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
      imports: [
        ReactiveFormsModule,
        BrowserAnimationsModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule
      ],
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
    fixture.detectChanges();  // Para actualizar la vista con el valor del formulario
    const addButton = fixture.debugElement.query(By.css('button[type="submit"]')).nativeElement;
    addButton.click();
    expect(todoService.addTodo).toHaveBeenCalledWith('Test Todo');
    expect(component.todoForm.controls['title'].value).toBeNull();
  });

  test('should not call addTodo if form is invalid', () => {
    jest.spyOn(todoService, 'addTodo');
    component.addTodo();
    expect(todoService.addTodo).not.toHaveBeenCalled();
  });

  // Prueba para verificar que el formulario se restablezca después de agregar un todo
  test('should reset the form after adding a todo', () => {
    component.todoForm.controls['title'].setValue('Test Todo');
    component.addTodo();
    expect(component.todoForm.controls['title'].value).toBeNull();
  });

  // Prueba para verificar la función addTodo cuando el formulario es válido
  test('should not add a todo when form is invalid', () => {
    component.addTodo();
    expect(todoService.addTodo).not.toHaveBeenCalled();
  });

  // Prueba para verificar el comportamiento del botón de envío cuando el formulario es válido
  test('should enable submit button when form is valid', () => {
    const addButton = fixture.debugElement.query(By.css('button[type="submit"]')).nativeElement;
    expect(addButton.disabled).toBeTruthy();

    component.todoForm.controls['title'].setValue('Test Todo');
    fixture.detectChanges();
    expect(addButton.disabled).toBeFalsy();
  });

  // Prueba para verificar el comportamiento del botón de envío cuando el formulario es inválido
  test('should disable submit button when form is invalid', () => {
    component.todoForm.controls['title'].setValue('');
    fixture.detectChanges();
    const addButton = fixture.debugElement.query(By.css('button[type="submit"]')).nativeElement;
    expect(addButton.disabled).toBeTruthy();
  });
});
