import { Component } from '@angular/core';
import { Todo, TodoService } from './services/todo.service';

@Component({
  selector: 'app-root',
  standalone: false,
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'todo-list-app';
  currentTab = 'tasks';
  showNewTaskModal = false;

  constructor(private todoService: TodoService) {}

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
