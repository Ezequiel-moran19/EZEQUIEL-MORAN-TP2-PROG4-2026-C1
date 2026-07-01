import { inject, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { UsuarioLogin } from '../interfaces/login.interface';
import { Usuario } from '../interfaces/usuario.interface';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private http = inject(HttpClient);
  
  logueado = signal(false);
  cargandoSesion = signal(true);

  authLogin(data: UsuarioLogin) {
    return this.http.post<{ usuario: Usuario; token: string }>(
      `${environment.apiUrl}/auth/login`,
      data,
      {
        withCredentials:true
      }
    );
  }

  authRegistro(formData: FormData) {

  return this.http.post(
    `${environment.apiUrl}/auth/registro`,
    formData,
    {
      withCredentials:true
    }
  );

  }
  actualizarUsuario(id: string, formData: FormData) {
    return this.http.patch(`${environment.apiUrl}/usuarios/${id}`, formData);
  }

  autorizar() {
    console.log('ejecutando autorizar');
    return this.http.post<Usuario>(
      `${environment.apiUrl}/auth/autorizar`,
      {},
      { withCredentials: true }
    );
  }

  refrescar() {
    return this.http.post<{ token: string }>(`${environment.apiUrl}/auth/refrescar`,
      {},
      {
        withCredentials: true
      }
    );
  }

  guardarToken(token:string){
    if(typeof localStorage !== 'undefined'){
      localStorage.setItem('token', token);
    }
  }

  guardarUsuario(usuario: Usuario, token?: string) {
    localStorage.setItem( 'usuario', JSON.stringify(usuario));

    if(token){
      localStorage.setItem( 'token', token);
    }

    this.logueado.set(true);
    this.cargandoSesion.set(false);
  }

  obtenerUsuarioLogueado(): Usuario | null {

    if (typeof localStorage === 'undefined') {
      return null;
    }

    const usuario = localStorage.getItem('usuario');

    return usuario ? JSON.parse(usuario) : null;
  }

  logout() {

    this.http.post(
      `${environment.apiUrl}/auth/logout`,
      {},
      { withCredentials:true }
    ).subscribe(() => {
      localStorage.removeItem('usuario');
      localStorage.removeItem('token');

      this.logueado.set(false);
      this.cargandoSesion.set(false);
    });
  }
}
