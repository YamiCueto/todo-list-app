import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { Todo, TodoService, TodoStatus } from '../../services/todo.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-calendar',
  standalone: false,
  templateUrl: './calendar.component.html',
  styleUrl: './calendar.component.css'
})
export class CalendarComponent implements OnInit, OnDestroy {
  todos: Todo[] = [];
  currentDate = new Date();
  selectedDate: Date | null = null;
  calendarDays: any[] = [];
  private todosSubscription: Subscription = new Subscription();

  constructor(private todoService: TodoService, private cdr: ChangeDetectorRef) {}

  ngOnInit() {
        // Suscribirse a cambios en las tareas para actualización en tiempo real
    this.todosSubscription = this.todoService.getTodos().subscribe((todos: Todo[]) => {
      this.todos = todos.filter(todo => todo.status !== TodoStatus.DELETED);
      this.generateCalendar();
      this.cdr.detectChanges(); // Forzar detección de cambios para actualización inmediata
    });
    this.generateCalendar();
  }

  ngOnDestroy() {
    this.todosSubscription.unsubscribe();
  }

  generateCalendar() {
    const year = this.currentDate.getFullYear();
    const month = this.currentDate.getMonth();

    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());

    this.calendarDays = [];
    const currentDay = new Date(startDate);

    for (let i = 0; i < 42; i++) {
      const dayTodos = this.getTodosForDate(currentDay);
      this.calendarDays.push({
        date: new Date(currentDay),
        isCurrentMonth: currentDay.getMonth() === month,
        isToday: this.isToday(currentDay),
        todos: dayTodos,
        todoCount: dayTodos.length
      });
      currentDay.setDate(currentDay.getDate() + 1);
    }
  }

  getTodosForDate(date: Date): Todo[] {
    return this.todos.filter(todo => {
      // Filtrar tareas eliminadas y comparar por fecha de creación
      if (todo.status === TodoStatus.DELETED) return false;

      const todoDate = new Date(todo.createdAt);
      return todoDate.toDateString() === date.toDateString();
    });
  }

  isToday(date: Date): boolean {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  }

  previousMonth() {
    this.currentDate.setMonth(this.currentDate.getMonth() - 1);
    this.generateCalendar();
  }

  nextMonth() {
    this.currentDate.setMonth(this.currentDate.getMonth() + 1);
    this.generateCalendar();
  }

  selectDate(day: any) {
    // Establecer la fecha seleccionada inmediatamente
    this.selectedDate = day.date;

    // Forzar detección de cambios para actualización visual inmediata
    this.cdr.detectChanges();
  }

  getMonthName(): string {
    return this.currentDate.toLocaleDateString('es-ES', {
      month: 'long',
      year: 'numeric'
    });
  }

  getSelectedDateTodos(): Todo[] {
    if (!this.selectedDate) return [];
    return this.getTodosForDate(this.selectedDate);
  }
}
