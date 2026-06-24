import { Component, inject, signal } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  authService = inject(AuthService);
  router = inject(Router);
  mensajeError = signal('');
  cargando = signal(false);

  formLogin = new FormGroup({
    usuario: new FormControl('', Validators.required),
    password: new FormControl('', [Validators.required, Validators.minLength(8), Validators.pattern(/^(?=.*[A-Z])(?=.*\d).+$/)])
  });

  login() {

    if (this.formLogin.invalid) {
      this.formLogin.markAllAsTouched();
      return;
    }

    this.cargando.set(true);
    this.mensajeError.set('');

    this.authService.authLogin({
      usuario: this.formLogin.value.usuario!,
      password: this.formLogin.value.password!
    })
    .subscribe({

      next: (resp: any) => {
        this.cargando.set(false);
        this.authService.guardarUsuario(resp.usuario);
        this.router.navigate(['/publicaciones']);
      },
      error: (err) => {
        this.cargando.set(false);

        if (err.status === 401 || err.status === 400) {
          this.mensajeError.set('Usuario o contraseña incorrectos');
        } else {
          this.mensajeError.set('Ocurrió un error al iniciar sesión');
        }

        this.resetearFormulario();
      }
    });
  }

  limpiarMensaje() {
    this.mensajeError.set('');
  }

   manejarError(error: any) {
    if (error.code === 'invalid_credentials') {
      this.mensajeError.set( 'Correo electrónico o contraseña incorrectos.' );

    } else {
      this.mensajeError.set( 'Error al iniciar sesión.' );

    }
    this.resetearFormulario();
  }

  resetearFormulario() {
    setTimeout(() => {
      this.formLogin.reset();
      this.mensajeError.set('');
      const inputUsuario = document.getElementById('usuario') as HTMLInputElement;
      inputUsuario?.focus();

    }, 3000);
  }

}
