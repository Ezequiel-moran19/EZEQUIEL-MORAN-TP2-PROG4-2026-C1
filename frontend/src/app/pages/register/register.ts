import { Component, inject, signal } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './register.html',
  styleUrl: './register.css',
})

export class Register {

  authService = inject(AuthService);
  router = inject(Router);
  private cdr = inject(ChangeDetectorRef);

  archivoSeleccionado: File | null = null;
  previewImagen: string | null = null;

  mensajeError = signal('');
  mensajeExito = signal('');
  cargando = signal(false);

  formRegistro = new FormGroup({
    nombre: new FormControl('', [ Validators.required, Validators.minLength(2) ]),
    apellido: new FormControl('', [ Validators.required, Validators.minLength(2) ]),
    email: new FormControl('', [ Validators.required, Validators.email ]),
    nombreUsuario: new FormControl('', [ Validators.required ]),
    password: new FormControl('', [ Validators.required, Validators.minLength(8), Validators.pattern(/^(?=.*[A-Z])(?=.*\d).+$/)]),
    repetirPassword: new FormControl('', [ Validators.required ]),
    fechaNacimiento: new FormControl('', [ Validators.required]),
    descripcion: new FormControl('', [ Validators.required ]),
    imagenPerfil: new FormControl('', [ Validators.required ]),
    perfil: new FormControl<'usuario' | 'administrador'>( 'usuario' )
  });

  registro() {

    if (this.formRegistro.invalid) {
      this.formRegistro.markAllAsTouched();
      this.mensajeError.set('Complete correctamente todos los campos');
      this.resetearForm();
      return;
    }

    if (!this.validarPasswords()) {
      return;
    }

    this.cargando.set(true);
    this.mensajeError.set('');
    this.mensajeExito.set('');

    const formData = this.crearFormData();


  for (const pair of formData.entries()) {
    console.log(pair[0], pair[1]);
}
    this.authService.authRegistro(formData)
      .subscribe({
        next: () => this.registroExitoso(),
        error: (err) => this.manejarError(err.error)
      });
  }

  resetearForm() {
    setTimeout(() => {
      this.formRegistro.reset();
      this.previewImagen = null;
      this.archivoSeleccionado = null;
      this.mensajeError.set('');
      this.mensajeExito.set('');
    }, 3000);
  }

  validarPasswords(): boolean {
    if (this.formRegistro.value.password !== this.formRegistro.value.repetirPassword) {
      this.mensajeError.set('Las contraseñas no coinciden');
      this.resetearForm();
      return false;
    }
    return true;
  }

  crearFormData(): FormData {
    const formData = new FormData();
    formData.append('nombre', this.formRegistro.value.nombre!);
    formData.append('apellido', this.formRegistro.value.apellido!);
    formData.append('email', this.formRegistro.value.email!);
    formData.append('nombreUsuario', this.formRegistro.value.nombreUsuario!);
    formData.append('password', this.formRegistro.value.password!);
    formData.append('repetirPassword',  this.formRegistro.value.repetirPassword!);
    formData.append('fechaNacimiento', this.formRegistro.value.fechaNacimiento!);
    formData.append('descripcion', this.formRegistro.value.descripcion!);
    formData.append('perfil', this.formRegistro.value.perfil ?? 'usuario');

    if (this.archivoSeleccionado) {
      formData.append('imagenPerfil', this.archivoSeleccionado);
    }
    return formData;
  }

  registroExitoso() {
    this.cargando.set(false);
    this.mensajeExito.set('Usuario registrado correctamente');
    this.formRegistro.reset();
    this.previewImagen = null;
    this.archivoSeleccionado = null;

    setTimeout(() => {
      this.router.navigate(['/login']);
    }, 2000);
  }

  manejarError(error: any) {

    this.cargando.set(false);

    if (typeof error.message === 'string') {
      if (error.message.toLowerCase().includes('existe')) {
        this.mensajeError.set('El usuario ya se encuentra registrado');
      } else {
        this.mensajeError.set(error.message);
      }

    } else if (Array.isArray(error.message)) {
      this.mensajeError.set(error.message.join(' - '));

    } else {
      this.mensajeError.set('Error al registrar usuario');
    }

    this.resetearForm();
  }

  seleccionarImagen(event: Event) {
    const input = event.target as HTMLInputElement;

    if (!input.files?.length) {
      return;
    }

    const archivo = input.files[0];

    if (!archivo.type.startsWith('image/')) {
      this.mensajeError.set( 'Debe seleccionar una imagen válida');
      return;
    }

    this.archivoSeleccionado = archivo;
    this.formRegistro.patchValue({ imagenPerfil: archivo.name });

    const reader = new FileReader();

    reader.onload = () => {
      this.previewImagen = reader.result as string;
      this.cdr.detectChanges();
    };
    reader.readAsDataURL(archivo);
  }
}
