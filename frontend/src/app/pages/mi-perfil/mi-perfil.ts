import { Component, inject } from '@angular/core';
import { Auth } from '../../services/auth';
import { Usuario } from '../../interfaces/usuario.interface';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-mi-perfil',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './mi-perfil.html',
  styleUrl: './mi-perfil.css',
})
export class MiPerfil {

    authService = inject(Auth);

  usuario: Usuario | null = this.authService.obtenerUsuarioLogueado();
}
