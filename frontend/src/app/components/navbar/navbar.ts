import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { Usuario } from '../../interfaces/usuario.interface';

@Component({
  selector: 'app-navbar',
  imports: [CommonModule, RouterLink],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})
export class Navbar {

  authService = inject(AuthService);
  router = inject(Router);

  usuario: Usuario | null = this.authService.obtenerUsuarioLogueado();

  logout(): void {

    this.authService.logout();

    this.router.navigate(['/']);

  }

}