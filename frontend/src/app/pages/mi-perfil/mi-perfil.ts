import { Component, inject, OnInit, ChangeDetectorRef } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Usuario } from '../../interfaces/usuario.interface';
import { CommonModule } from '@angular/common';
import { Publicacion } from '../../interfaces/publicacion.interface';
import { PublicacionesService } from '../../services/publicaciones.service';
import { PostCard } from '../../components/post-card/post-card';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-mi-perfil',
  standalone: true,
  imports: [CommonModule, PostCard, ReactiveFormsModule],
  templateUrl: './mi-perfil.html',
  styleUrl: './mi-perfil.css',
})
export class MiPerfil implements OnInit {

  authService = inject(AuthService);
  publicacionesService = inject(PublicacionesService);
  private cdr = inject(ChangeDetectorRef);
  private fb = inject(FormBuilder);

  usuario: Usuario | null = null;
  imagenNueva: File | null = null;
  publicaciones: Publicacion[] = [];

  ngOnInit() {
    this.usuario = this.authService.obtenerUsuarioLogueado();

    if (this.usuario) {
      this.formEditar.patchValue({
        nombre: this.usuario.nombre,
        apellido: this.usuario.apellido,
        descripcion: this.usuario.descripcion,
      });
    }

    this.cargarMisPublicaciones();
  }

  formEditar = this.fb.group({
    nombre: [''],
    apellido: [''],
    descripcion: ['']
  });
  
  cargarMisPublicaciones(){

    if(!this.usuario) return;

    this.publicacionesService.obtenerPublicaciones()
    .subscribe({

      next:(publicaciones)=>{
        this.publicaciones = publicaciones
          .filter(p => p.autor && p.autor._id === this.usuario?._id)
          .slice(0,3);
        this.cdr.detectChanges();
      }
    });
  }

  eliminarPublicacion(id: string) {

    this.publicacionesService
      .eliminarPublicacion(id)
      .subscribe(() => this.cargarMisPublicaciones());

  }

  seleccionarImagen(event:any){

    const archivo = event.target.files[0];

    if(archivo){
      this.imagenNueva = archivo;
    }

  }

  guardarCambios() {

    if (!this.usuario) return;

    const formData = new FormData();

    formData.append('nombre', this.formEditar.value.nombre!);
    formData.append('apellido', this.formEditar.value.apellido!);
    formData.append('descripcion', this.formEditar.value.descripcion!);

    if (this.imagenNueva) {
      formData.append('imagenPerfil', this.imagenNueva);
    }

    this.authService
      .actualizarUsuario(this.usuario._id!, formData)
      .subscribe({

      next: (usuarioActualizado: any) => {

        this.usuario = usuarioActualizado;
        this.authService.guardarUsuario(usuarioActualizado);

        this.formEditar.patchValue({
          nombre: usuarioActualizado.nombre,
          apellido: usuarioActualizado.apellido,
          descripcion: usuarioActualizado.descripcion,
        });

        this.imagenNueva = null;

        this.cdr.detectChanges(); 

        if (typeof document !== 'undefined') {
          const cerrar = document.querySelector(
            '#editarPerfilModal [data-bs-dismiss="modal"]'
          ) as HTMLButtonElement;

          cerrar?.click();
        }
      }

      });
  }
}