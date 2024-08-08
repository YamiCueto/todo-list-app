import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TodoItemComponent } from './todo-item.component';
import { Todo } from '../../services/todo.service';
import { By } from '@angular/platform-browser';

describe('TodoItemComponent', () => {
  let component: TodoItemComponent;
  let fixture: ComponentFixture<TodoItemComponent>;
  const mockTodo: Todo = { id: 1, title: 'Test Todo', completed: false };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TodoItemComponent ]
    }).compileComponents();

    fixture = TestBed.createComponent(TodoItemComponent);
    component = fixture.componentInstance;
    component.todo = mockTodo;
    fixture.detectChanges();
  });

  test('should create', () => {
    expect(component).toBeTruthy();
  });

  test('should display todo title', () => {
    const titleElement = fixture.debugElement.query(By.css('span')).nativeElement;
    expect(titleElement.textContent).toBe('Test Todo');
  });

  test('should emit delete event', () => {
    jest.spyOn(component.delete, 'emit');
    const buttonElement = fixture.debugElement.query(By.css('button')).nativeElement;
    buttonElement.click();
    expect(component.delete.emit).toHaveBeenCalledWith(mockTodo.id);
  });

  test('should emit toggle event', () => {
    jest.spyOn(component.toggle, 'emit');
    const checkboxElement = fixture.debugElement.query(By.css('input[type="checkbox"]')).nativeElement;
    checkboxElement.click();
    expect(component.toggle.emit).toHaveBeenCalledWith(mockTodo.id);
  });

  test('should display completed class when todo is completed', () => {
    component.todo.completed = true;
    fixture.detectChanges();
    const titleElement = fixture.debugElement.query(By.css('span')).nativeElement;
    expect(titleElement.classList).toContain('completed');
  });
});
