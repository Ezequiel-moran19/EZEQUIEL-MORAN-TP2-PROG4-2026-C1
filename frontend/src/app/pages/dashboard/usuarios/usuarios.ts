import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { RouterLink } from '@angular/router';
import { UsuariosService } from '../../../services/usuarios.service';
import { Usuario } from '../../../interfaces/usuario.interface';

@Component({
  selector: 'app-usuarios',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './usuarios.html',
  styleUrl: './usuarios.css',
})
export class Usuarios implements OnInit {

  usuarios: Usuario[] = [];
  private cdr = inject(ChangeDetectorRef);
  private usuariosService = inject(UsuariosService);

  ngOnInit() {
    this.cargarUsuarios();
  }

  cargarUsuarios(){

    this.usuariosService
    .obtenerUsuarios()
    .subscribe((data)=>{
      this.usuarios = data;
      this.cdr.detectChanges();
    });
  }

  cambiarEstado(usuario: Usuario) {
    if (usuario.activo) {
      this.usuariosService
        .bajaUsuario(usuario._id)
        .subscribe(() => this.cargarUsuarios());
    } else {
      this.usuariosService
        .altaUsuario(usuario._id)
        .subscribe(() => this.cargarUsuarios());
    }
  }
}