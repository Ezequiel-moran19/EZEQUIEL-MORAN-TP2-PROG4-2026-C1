import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Publicacion } from '../../interfaces/publicacion.interface';

@Component({
  selector: 'app-post-card',
  standalone: true,
  imports: [],
  templateUrl: './post-card.html',
  styleUrl: './post-card.css',
})
export class PostCard {

  @Input() publicacion!: Publicacion;
  @Input() usuarioId!: string;
  @Output() like = new EventEmitter<string>();
  @Output() eliminar = new EventEmitter<string>();
  @Input() perfil!: string;
  
  usuarioDioLike(): boolean {

    if (!this.usuarioId || !this.publicacion.likes) {
      return false;
    }

    return this.publicacion.likes.includes(this.usuarioId);
  }

  puedeEliminar(): boolean {

    return (
      this.publicacion.autor &&
      this.publicacion.autor._id === this.usuarioId ||
      this.perfil === 'administrador'
    );

  }
}