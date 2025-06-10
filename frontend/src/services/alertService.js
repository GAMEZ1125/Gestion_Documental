import Swal from 'sweetalert2';

class AlertService {
  // Alerta de éxito
  static success(title, text = '') {
    return Swal.fire({
      icon: 'success',
      title: title,
      text: text,
      confirmButtonColor: '#2563eb',
      timer: 3000,
      timerProgressBar: true
    });
  }

  // Alerta de error
  static error(title, text = '') {
    return Swal.fire({
      icon: 'error',
      title: title,
      text: text,
      confirmButtonColor: '#dc2626'
    });
  }

  // Alerta de confirmación
  static confirm(title, text = '') {
    return Swal.fire({
      title: title,
      text: text,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#2563eb',
      cancelButtonColor: '#dc2626',
      confirmButtonText: 'Sí, continuar',
      cancelButtonText: 'Cancelar'
    });
  }

  // Alerta de información
  static info(title, text = '') {
    return Swal.fire({
      icon: 'info',
      title: title,
      text: text,
      confirmButtonColor: '#2563eb'
    });
  }

  // Alerta de carga
  static loading(title = 'Procesando...') {
    Swal.fire({
      title: title,
      allowOutsideClick: false,
      allowEscapeKey: false,
      showConfirmButton: false,
      didOpen: () => {
        Swal.showLoading();
      }
    });
  }

  // Cerrar alerta de carga
  static close() {
    Swal.close();
  }
}

export default AlertService;