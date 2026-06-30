import { Component, EventEmitter, inject, Output } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { PublicacionesService } from '../../services/publicaciones.service';
import { AuthService } from '../../services/auth.service';
import imageCompression from 'browser-image-compression';

@Component({
  selector: 'app-post-form',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './post-form.html',
  styleUrl: './post-form.css',
})
export class PostForm {

  private fb = inject(FormBuilder);
  private publicacionesService = inject(PublicacionesService);
  private authService = inject(AuthService);

  @Output() creada = new EventEmitter<void>();
  archivo?: File;

  form = this.fb.group({ titulo: ['', Validators.required], descripcion: ['', Validators.required] });

  async seleccionarArchivo(event: Event) {

    const input = event.target as HTMLInputElement;

    if (input.files?.length) {

      const imagen = input.files[0];
      if (imagen.type === 'image/jpeg' || imagen.type === 'image/jpg') {

        const opciones = {
          maxSizeMB: 1,
          maxWidthOrHeight: 1200,
          useWebWorker: true
        };

        this.archivo = await imageCompression(imagen, opciones);

      } else {

        this.archivo = imagen;

      }
    }
  }
  crearPublicacion() {

    const usuario = this.authService.obtenerUsuarioLogueado();
    if (!usuario) return;

    const formData = new FormData();
    formData.append('descripcion', this.form.value.descripcion ?? '');
    formData.append('autor', usuario._id!);

    if (this.archivo) {
      formData.append('imagen', this.archivo);
    }

    this.publicacionesService.crearPublicacion(formData)
      .subscribe({
        next: () => {

         this.form.reset();
         this.archivo = undefined;

        setTimeout(()=>{
          this.creada.emit();
        },100);

        }
      });
  }
}