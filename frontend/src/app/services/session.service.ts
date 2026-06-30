import { Injectable, inject, signal } from '@angular/core';
import { AuthService } from './auth.service';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class SessionService {

  private auth = inject(AuthService);
  private router = inject(Router);  
  private timerModal: any;
  private timerLogout: any;
  mostrarModal = signal(false);

  iniciarSesion() {

    this.limpiarTimers();

    this.timerModal = setTimeout(() => {
      this.mostrarModal.set(true);
    }, 5 * 60 * 1000);

    this.timerLogout = setTimeout(() => {
      this.cerrarSesion();
    }, 10 * 60 * 1000);

  }

  extenderSesion() {

    this.auth.refrescar().subscribe({
      next: () => {
        this.mostrarModal.set(false);
        this.iniciarSesion();
      },
      error: () => {
        this.cerrarSesion();
      }
    });

  }

  cancelarSesion() {
    this.cerrarSesion();
  }

  cerrarSesion() {

    this.limpiarTimers();
    this.mostrarModal.set(false);
    this.auth.logout();
    this.router.navigate(['/login']);

  }

  private limpiarTimers() {

    if (this.timerModal) {
      clearTimeout(this.timerModal);
    }

    if (this.timerLogout) {
      clearTimeout(this.timerLogout);
    }
  }
}

  // this.timerModal = setTimeout(() => {
  //   this.mostrarModal.set(true);
  // }, 10 * 1000); // 10 segundos

  // this.timerLogout = setTimeout(() => {
  //   this.cerrarSesion();
  // }, 20 * 1000); // 20 segundos