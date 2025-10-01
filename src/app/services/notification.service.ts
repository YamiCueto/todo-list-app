import { Injectable } from '@angular/core';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  constructor() { }

  // Notificación de éxito
  showSuccess(title: string, text?: string) {
    return Swal.fire({
      icon: 'success',
      title: title,
      text: text,
      toast: true,
      position: 'top-end',
      showConfirmButton: false,
      timer: 3000,
      timerProgressBar: true,
      background: '#f8f9fa',
      color: '#28a745'
    });
  }

  // Notificación de error
  showError(title: string, text?: string) {
    return Swal.fire({
      icon: 'error',
      title: title,
      text: text,
      toast: true,
      position: 'top-end',
      showConfirmButton: false,
      timer: 4000,
      timerProgressBar: true,
      background: '#f8f9fa',
      color: '#dc3545'
    });
  }

  // Notificación de advertencia
  showWarning(title: string, text?: string) {
    return Swal.fire({
      icon: 'warning',
      title: title,
      text: text,
      toast: true,
      position: 'top-end',
      showConfirmButton: false,
      timer: 3500,
      timerProgressBar: true,
      background: '#f8f9fa',
      color: '#ffc107'
    });
  }

  // Notificación de información
  showInfo(title: string, text?: string) {
    return Swal.fire({
      icon: 'info',
      title: title,
      text: text,
      toast: true,
      position: 'top-end',
      showConfirmButton: false,
      timer: 3000,
      timerProgressBar: true,
      background: '#f8f9fa',
      color: '#17a2b8'
    });
  }

  // Confirmación de eliminación
  confirmDelete(title: string = '¿Estás seguro?', text: string = 'Esta acción no se puede deshacer') {
    return Swal.fire({
      title: title,
      text: text,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#dc3545',
      cancelButtonColor: '#6c757d',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
      background: '#ffffff',
      customClass: {
        popup: 'swal-popup',
        title: 'swal-title'
      }
    });
  }

  // Confirmación general
  confirm(title: string, text?: string) {
    return Swal.fire({
      title: title,
      text: text,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#007bff',
      cancelButtonColor: '#6c757d',
      confirmButtonText: 'Sí',
      cancelButtonText: 'No',
      background: '#ffffff'
    });
  }
}
