import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { Publicacion } from '../../interfaces/publicacion.interface';
import { Router } from '@angular/router';

@Component({
  selector: 'app-post-card',
  standalone: true,
  imports: [],
  templateUrl: './post-card.html',
  styleUrl: './post-card.css',
})
export class PostCard {
  router = inject(Router);
  @Input() publicacion!: Publicacion;
  @Input() usuarioId!: string;
  @Output() like = new EventEmitter<string>();
  @Output() eliminar = new EventEmitter<string>();
  @Input() perfil!: string;
  @Output() editar = new EventEmitter<string>();
  @Output() baja = new EventEmitter<string>();

  usuarioDioLike(): boolean {

    if (!this.usuarioId || !this.publicacion.likes) {
      return false;
    }

    return this.publicacion.likes.includes(this.usuarioId);
  }

  puedeEliminar(): boolean {
    return (this.publicacion.autor && this.publicacion.autor._id === this.usuarioId || this.perfil === 'administrador');
  }

  editarPublicacion(){
      this.editar.emit(this.publicacion._id!);
  }
  
  verDetalle(){
    this.router.navigate([
      '/publicaciones',
      this.publicacion._id
    ]);
  }
}