import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { UsuariosService } from '../../../../services/usuarios.service';
import { CrearUsuarioDto } from '../../../../interfaces/crear-usuario.interface';
import { Router } from '@angular/router';
import { Validators } from '@angular/forms';

@Component({
  selector: 'app-crear-usuario',
  standalone:true,
  imports: [ReactiveFormsModule],
  templateUrl: './crear-usuario.html',
  styleUrl: './crear-usuario.css',
})
export class CrearUsuario {
  
  private usuariosService = inject(UsuariosService);
  private router = inject(Router);
  mensaje = '';
  tipoMensaje: 'success' | 'error' | '' = '';

  form = new FormGroup({
    nombre: new FormControl('', [ Validators.required, Validators.minLength(2) ]),
    apellido: new FormControl('', [ Validators.required ]),
    email: new FormControl('', [ Validators.required, Validators.email ]),
    nombreUsuario: new FormControl('', [ Validators.required, Validators.minLength(4) ]),
    password: new FormControl('', [ Validators.required, Validators.minLength(6) ]),
    perfil: new FormControl('usuario')
  });

  crear() {

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.usuariosService
      .crearUsuario(this.form.value as CrearUsuarioDto)
      .subscribe({
        next: () => {

          this.mensaje = 'Usuario creado correctamente';
          this.tipoMensaje = 'success';

          this.form.reset({ perfil: 'usuario' });

          setTimeout(() => {
            this.router.navigate(['/dashboard/usuarios']);
          }, 800);

        },
        error: () => {
          this.mensaje = 'Error al crear usuario';
          this.tipoMensaje = 'error';
        }
      });
  }
}
