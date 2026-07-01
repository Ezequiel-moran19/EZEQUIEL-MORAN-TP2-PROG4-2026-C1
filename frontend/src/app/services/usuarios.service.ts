import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Usuario } from '../interfaces/usuario.interface';
import { CrearUsuarioDto   } from '../interfaces/crear-usuario.interface';

@Injectable({
  providedIn: 'root',
})
export class UsuariosService {

  private http = inject(HttpClient);
  private api = `${environment.apiUrl}/usuarios`;

  obtenerUsuarios(){
    return this.http.get<Usuario[]>(this.api);
  }

  crearUsuario(data: CrearUsuarioDto){
   return this.http.post<Usuario>(this.api,data);
  }

  bajaUsuario(id:string){
    return this.http.delete(`${this.api}/${id}`);
  }

  altaUsuario(id:string){
    return this.http.post(`${this.api}/${id}/rehabilitar`, {});
  }
}