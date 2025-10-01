import { Component, OnInit } from '@angular/core';
import { Todo, TodoService, TodoStatus } from '../../services/todo.service';

@Component({
  selector: 'app-todo-list',
  standalone: false,
  templateUrl: './todo-list.component.html',
  styleUrl: './todo-list.component.css'
})
export class TodoListComponent implements OnInit {
  todos: Todo[] = [];
  selectedTask: Todo | null = null;
  showTaskDetail = false;
  isLoading = false;

  TodoStatus = TodoStatus;

  constructor(private todoService: TodoService) {}

  ngOnInit(): void {
    this.loadTodos();
  }

  private loadTodos(): void {
    this.isLoading = true;
    this.todoService.getTodos().subscribe({
      next: (todos) => {
        this.todos = todos.filter(todo => todo.status !== TodoStatus.DELETED);
        this.isLoading = false;
      },
      error: (error) => {
        this.isLoading = false;
        console.error('Error loading todos:', error);
      }
    });
  }

  onTaskClick(task: Todo): void {
    this.selectedTask = { ...task };
    this.showTaskDetail = true;
  }

  onTaskDetailClose(): void {
    this.showTaskDetail = false;
    this.selectedTask = null;
  }

  onTaskSave(updatedTask: Todo): void {
    const result = this.todoService.updateTodo(updatedTask);
    if (result.success) {
      this.showTaskDetail = false;
      this.selectedTask = null;
    }
  }

  onTaskDelete(taskId: number): void {
    const result = this.todoService.updateTodoStatus(taskId, TodoStatus.DELETED);
    if (result.success) {
      this.showTaskDetail = false;
      this.selectedTask = null;
    }
  }

  toggleTaskStatus(task: Todo): void {
    const newStatus = task.status === TodoStatus.COMPLETED ? TodoStatus.PENDING : TodoStatus.COMPLETED;
    this.todoService.updateTodoStatus(task.id, newStatus);
  }

  getStatusColor(status: TodoStatus): string {
    switch (status) {
      case TodoStatus.IN_PROGRESS: return '#fd7e14';
      case TodoStatus.COMPLETED: return '#28a745';
      case TodoStatus.SUSPENDED: return '#ffc107';
      default: return '#6c757d';
    }
  }

  getStatusText(status: TodoStatus): string {
    switch (status) {
      case TodoStatus.PENDING: return 'Pendiente por iniciar';
      case TodoStatus.IN_PROGRESS: return 'En progreso';
      case TodoStatus.COMPLETED: return 'Terminada';
      case TodoStatus.SUSPENDED: return 'Suspendida';
      default: return 'Desconocido';
    }
  }

  getStatusIcon(status: TodoStatus): string {
    switch (status) {
      case TodoStatus.PENDING: return 'radio_button_unchecked';
      case TodoStatus.IN_PROGRESS: return 'hourglass_empty';
      case TodoStatus.COMPLETED: return 'check_circle';
      case TodoStatus.SUSPENDED: return 'pause_circle';
      default: return 'help_outline';
    }
  }

  getTasksByStatus(status: TodoStatus): Todo[] {
    return this.todos.filter(todo => todo.status === status);
  }

  getTotalTasks(): number {
    return this.todos.length;
  }

  getCompletedTasks(): number {
    return this.todos.filter(todo => todo.status === TodoStatus.COMPLETED).length;
  }

  getInProgressTasks(): number {
    return this.todos.filter(todo => todo.status === TodoStatus.IN_PROGRESS).length;
  }

  getPendingTasks(): number {
    return this.todos.filter(todo => todo.status === TodoStatus.PENDING).length;
  }

  getCategoryIcon(title: string): string {
    const titleLower = title.toLowerCase();

    // Íconos de trabajo/reuniones
    if (titleLower.includes('reunión') || titleLower.includes('meeting') || titleLower.includes('junta')) return 'groups';
    if (titleLower.includes('presentación') || titleLower.includes('presentar')) return 'slideshow';
    if (titleLower.includes('informe') || titleLower.includes('reporte') || titleLower.includes('report')) return 'assessment';
    if (titleLower.includes('revisar') || titleLower.includes('review') || titleLower.includes('validar')) return 'fact_check';
    if (titleLower.includes('enviar') || titleLower.includes('correo') || titleLower.includes('email')) return 'mail';
    if (titleLower.includes('coordinar') || titleLower.includes('organizar')) return 'event_note';
    if (titleLower.includes('actualizar') || titleLower.includes('update')) return 'system_update';
    if (titleLower.includes('base de datos') || titleLower.includes('datos') || titleLower.includes('database')) return 'storage';

    // Íconos de desarrollo/tecnología
    if (titleLower.includes('código') || titleLower.includes('programming') || titleLower.includes('dev')) return 'code';
    if (titleLower.includes('bug') || titleLower.includes('error') || titleLower.includes('fix')) return 'bug_report';
    if (titleLower.includes('test') || titleLower.includes('prueba')) return 'science';
    if (titleLower.includes('deploy') || titleLower.includes('subir') || titleLower.includes('publicar')) return 'publish';

    // Íconos de compras/finanzas
    if (titleLower.includes('comprar') || titleLower.includes('shopping') || titleLower.includes('tienda')) return 'shopping_cart';
    if (titleLower.includes('pagar') || titleLower.includes('factura') || titleLower.includes('dinero')) return 'payment';
    if (titleLower.includes('presupuesto') || titleLower.includes('budget')) return 'account_balance_wallet';

    // Íconos de salud/ejercicio
    if (titleLower.includes('ejercicio') || titleLower.includes('gym') || titleLower.includes('deporte')) return 'fitness_center';
    if (titleLower.includes('médico') || titleLower.includes('doctor') || titleLower.includes('cita')) return 'local_hospital';
    if (titleLower.includes('medicamento') || titleLower.includes('pastilla')) return 'medication';

    // Íconos de hogar/personal
    if (titleLower.includes('limpiar') || titleLower.includes('limpieza')) return 'cleaning_services';
    if (titleLower.includes('cocinar') || titleLower.includes('receta') || titleLower.includes('comida')) return 'restaurant';
    if (titleLower.includes('lavar') || titleLower.includes('ropa')) return 'local_laundry_service';
    if (titleLower.includes('viaje') || titleLower.includes('viajar') || titleLower.includes('trip')) return 'flight';
    if (titleLower.includes('cumpleaños') || titleLower.includes('celebrar') || titleLower.includes('fiesta')) return 'celebration';

    // Íconos de estudio/educación
    if (titleLower.includes('estudiar') || titleLower.includes('leer') || titleLower.includes('libro')) return 'menu_book';
    if (titleLower.includes('curso') || titleLower.includes('clase') || titleLower.includes('aprender')) return 'school';
    if (titleLower.includes('tarea') || titleLower.includes('homework') || titleLower.includes('assignment')) return 'assignment';

    // Íconos de comunicación
    if (titleLower.includes('llamar') || titleLower.includes('teléfono') || titleLower.includes('call')) return 'phone';
    if (titleLower.includes('mensaje') || titleLower.includes('chat') || titleLower.includes('whatsapp')) return 'message';
    if (titleLower.includes('red social') || titleLower.includes('post') || titleLower.includes('publicar')) return 'share';

    // Ícono por defecto
    return 'task';
  }

  getPriorityIcon(task: Todo): string {
    const titleLower = task.title.toLowerCase();

    // Urgente/Importante
    if (titleLower.includes('urgente') || titleLower.includes('importante') || titleLower.includes('crítico')) {
      return 'priority_high';
    }

    // Fechas próximas
    if (task.dueDate) {
      const today = new Date();
      const dueDate = new Date(task.dueDate);
      const diffTime = dueDate.getTime() - today.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      if (diffDays <= 1) return 'priority_high';
      if (diffDays <= 3) return 'schedule';
    }

    return '';
  }

  getDateIcon(task: Todo): string {
    if (!task.dueDate) return '';

    const today = new Date();
    const dueDate = new Date(task.dueDate);
    const diffTime = dueDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) return 'event_busy'; // Vencida
    if (diffDays === 0) return 'today'; // Hoy
    if (diffDays <= 3) return 'event'; // Próxima

    return 'calendar_month'; // Futura
  }

  getDateColor(task: Todo): string {
    if (!task.dueDate) return '#6c757d';

    const today = new Date();
    const dueDate = new Date(task.dueDate);
    const diffTime = dueDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) return '#dc3545'; // Rojo - Vencida
    if (diffDays === 0) return '#fd7e14'; // Naranja - Hoy
    if (diffDays <= 3) return '#ffc107'; // Amarillo - Próxima

    return '#28a745'; // Verde - Futura
  }
}
