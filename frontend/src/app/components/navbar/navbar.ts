import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { Usuario } from '../../interfaces/usuario.interface';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})
export class Navbar implements OnInit {
  authService = inject(AuthService);
  router = inject(Router);
  
  estaLogueado = this.authService.logueado;
  usuario = signal<Usuario | null>(null);

  ngOnInit() {
    const usuarioActual = this.authService.obtenerUsuarioLogueado();
    if (usuarioActual) {
      this.usuario.set(usuarioActual);
    }
  }

  logout() {
    this.authService.logout();
    this.usuario.set(null);
    this.router.navigate(['/login']);
  }
}