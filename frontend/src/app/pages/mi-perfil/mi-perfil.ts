import { Component, inject, OnInit, ChangeDetectorRef } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Usuario } from '../../interfaces/usuario.interface';
import { CommonModule } from '@angular/common';
import { Publicacion } from '../../interfaces/publicacion.interface';
import { PublicacionesService } from '../../services/publicaciones.service';
import { PostCard } from '../../components/post-card/post-card';

@Component({
  selector: 'app-mi-perfil',
  standalone: true,
  imports: [CommonModule, PostCard],
  templateUrl: './mi-perfil.html',
  styleUrl: './mi-perfil.css',
})
export class MiPerfil implements OnInit {

  authService = inject(AuthService);
  publicacionesService = inject(PublicacionesService);
  private cdr = inject(ChangeDetectorRef);

  usuario: Usuario | null = null;

  ultimasPublicaciones: Publicacion[] = [];

  ngOnInit(){
    this.usuario = this.authService.obtenerUsuarioLogueado();
    this.cargarMisPublicaciones();
  }

  cargarMisPublicaciones(){

    if(!this.usuario) return;

    this.publicacionesService.obtenerPublicaciones()
    .subscribe({

      next:(publicaciones)=>{
        this.ultimasPublicaciones = publicaciones
          .filter(p => p.autor._id === this.usuario?._id)
          .slice(0,3);
        this.cdr.detectChanges();
      }
    });
  }

  eliminarPublicacion(id:string){

    if(!this.usuario) return;

    this.publicacionesService
      .eliminarPublicacion(id, this.usuario._id!, this.usuario.perfil)
      .subscribe(()=> this.cargarMisPublicaciones());
  }
}