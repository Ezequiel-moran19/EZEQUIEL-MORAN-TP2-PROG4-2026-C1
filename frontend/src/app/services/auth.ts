import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { UsuarioLogin } from '../interfaces/login.interface';
import { Usuario } from '../interfaces/usuario.interface';

@Injectable({
  providedIn: 'root',
})
export class Auth {

  private http = inject(HttpClient);

  authLogin(data: UsuarioLogin) {
    return this.http.post( `${environment.apiUrl}/auth/login`, data);
  }

  authRegistro(formData: FormData) {
    return this.http.post( `${environment.apiUrl}/auth/registro`, formData);
  }

  estaLogueado(): boolean {

    if (typeof window === 'undefined') {
      return false;
    }
    return localStorage.getItem('usuario') !== null;
  }

  guardarUsuario(usuario: Usuario): void {
    localStorage.setItem('usuario', JSON.stringify(usuario));
  }

  obtenerUsuarioLogueado(): Usuario | null {
    const usuario = localStorage.getItem('usuario');
    return usuario ? JSON.parse(usuario) : null;
  }

  logout(): void {
    localStorage.removeItem('usuario');
  }

}