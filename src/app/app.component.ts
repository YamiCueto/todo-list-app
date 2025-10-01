import { Component, OnInit } from '@angular/core';
import { Todo, TodoService } from './services/todo.service';
import { ThemeService } from './services/theme.service';

@Component({
  selector: 'app-root',
  standalone: false,
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'todo-list-app';
  currentTab = 'tasks';
  showNewTaskModal = false;

  constructor(
    private todoService: TodoService,
    private themeService: ThemeService
  ) {}

  ngOnInit(): void {
    // El servicio de tema se inicializa automáticamente y carga el tema guardado
    // No necesitamos hacer nada más aquí
  }

  onTabChanged(tab: string) {
    this.currentTab = tab;
  }

  onFabClick() {
    if (this.currentTab === 'tasks') {
      this.showNewTaskModal = true;
    }
  }

  onNewTaskModalClose() {
    this.showNewTaskModal = false;
  }

  onNewTaskSave(task: Todo) {
    this.todoService.addTodo(task.title, task.description, task.dueDate);
    this.showNewTaskModal = false;
  }
}
