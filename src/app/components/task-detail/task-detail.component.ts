import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Todo, TodoStatus } from '../../services/todo.service';
import { NotificationService } from '../../services/notification.service';

@Component({
  selector: 'app-task-detail',
  standalone: false,
  templateUrl: './task-detail.component.html',
  styleUrl: './task-detail.component.css'
})
export class TaskDetailComponent {
  @Input() task: Todo | null = null;
  @Input() isVisible: boolean = false;
  @Output() close = new EventEmitter<void>();
  @Output() save = new EventEmitter<Todo>();
  @Output() delete = new EventEmitter<number>();

  taskForm: FormGroup;
  TodoStatus = TodoStatus;

  constructor(private fb: FormBuilder, private notificationService: NotificationService) {
    this.taskForm = this.fb.group({
      title: ['', [Validators.required, Validators.maxLength(100)]],
      description: ['', [Validators.maxLength(500)]],
      status: [TodoStatus.PENDING]
    });
  }

  ngOnChanges() {
    if (this.task) {
      // Editando tarea existente
      this.taskForm.patchValue({
        title: this.task.title,
        description: this.task.description || '',
        status: this.task.status
      });
    } else {
      // Creando nueva tarea
      this.taskForm.patchValue({
        title: '',
        description: '',
        status: TodoStatus.PENDING
      });
    }
  }

  onSave() {
    if (this.taskForm.valid) {
      if (this.task) {
        // Editando tarea existente
        const updatedTask: Todo = {
          ...this.task,
          title: this.taskForm.value.title,
          description: this.taskForm.value.description,
          status: this.taskForm.value.status,
          updatedAt: new Date()
        };
        this.save.emit(updatedTask);
      } else {
        // Creando nueva tarea
        const newTask: Todo = {
          id: 0, // Se asignará en el servicio
          title: this.taskForm.value.title,
          description: this.taskForm.value.description,
          status: this.taskForm.value.status,
          completed: false,
          createdAt: new Date(),
          updatedAt: new Date()
        };
        this.save.emit(newTask);
      }
    }
  }

  onDelete() {
    if (this.task) {
      this.notificationService.confirmDelete(
        '¿Eliminar tarea?',
        `¿Estás seguro de que quieres eliminar "${this.task.title}"? Esta acción no se puede deshacer.`
      ).then((result) => {
        if (result.isConfirmed && this.task) {
          this.delete.emit(this.task.id);
        }
      });
    }
  }

  onClose() {
    this.close.emit();
  }

  getStatusColor(status: TodoStatus): string {
    switch (status) {
      case TodoStatus.IN_PROGRESS: return 'orange';
      case TodoStatus.COMPLETED: return 'green';
      case TodoStatus.SUSPENDED: return 'orange';
      case TodoStatus.DELETED: return 'red';
      default: return 'gray';
    }
  }

  getStatusText(status: TodoStatus): string {
    switch (status) {
      case TodoStatus.PENDING: return 'Pendiente por iniciar';
      case TodoStatus.IN_PROGRESS: return 'En progreso';
      case TodoStatus.COMPLETED: return 'Completada';
      case TodoStatus.SUSPENDED: return 'Suspendida';
      case TodoStatus.DELETED: return 'Eliminada';
      default: return 'Desconocido';
    }
  }
}
