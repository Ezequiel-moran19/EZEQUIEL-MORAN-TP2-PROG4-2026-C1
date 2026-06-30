import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ComentariosService {

  private http = inject(HttpClient);
  private api = `${environment.apiUrl}`;

  obtenerComentarios(publicacionId:string, offset = 0, limit = 5){
    return this.http.get<any[]>(
      `${this.api}/comentarios/${publicacionId}?offset=${offset}&limit=${limit}`,
      {
        withCredentials:true
      }
    );
  }

  crearComentario(publicacionId:string, data:any){
    return this.http.post(
      `${this.api}/comentarios/${publicacionId}`,
      data,
      {
        withCredentials:true
      }
    );
  }

  editarComentario(id:string, mensaje:string){
    return this.http.put(
      `${this.api}/comentarios/${id}`,
      { mensaje },
      {
        withCredentials:true
      }
    );

  }

}