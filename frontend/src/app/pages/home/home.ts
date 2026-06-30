import { Component, inject, OnInit } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { Bienvenida } from '../../components/bienvenida/bienvenida';
import { Navbar } from '../../components/navbar/navbar';
import { AuthService } from '../../services/auth.service';
import { SessionModal } from '../../components/session-modal/session-modal';
import { LoadingComponent } from '../loading/loading';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterOutlet, Bienvenida, Navbar, SessionModal, LoadingComponent],
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class Home implements OnInit {

  auth = inject(AuthService);
  router = inject(Router);
  logueado = this.auth.logueado;

  ngOnInit(){

    this.auth.cargandoSesion.set(true);

    this.auth.autorizar().subscribe({

      next: (usuario) => {
        this.auth.guardarUsuario(usuario);
        this.auth.logueado.set(true);
        this.auth.cargandoSesion.set(false);

        if(this.router.url === '/login' || this.router.url === '/register' || this.router.url === '/'){
          this.router.navigate(['/publicaciones']);
        }
      },

      error: () => {
        this.auth.logout();
        this.auth.cargandoSesion.set(false);
      }

    });

  }
}