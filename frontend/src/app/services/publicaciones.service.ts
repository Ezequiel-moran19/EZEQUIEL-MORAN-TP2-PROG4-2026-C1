import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Publicacion } from '../interfaces/publicacion.interface';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class PublicacionesService {

  private http = inject(HttpClient);
  private api = `${environment.apiUrl}/publicaciones`;

  obtenerPublicaciones(orden = 'fecha', offset = 0, limit = 10 ) {
    return this.http.get<Publicacion[]>(
      `${this.api}?orden=${orden}&offset=${offset}&limit=${limit}`
    );
  }

  obtenerPublicacionId(id:string){
    return this.http.get<Publicacion>(
      `${this.api}/${id}`
    );
  }

  crearPublicacion(formData: FormData) {
    return this.http.post(this.api, formData);
  }

  darDeBajaPublicacion(id:string){
    return this.http.patch(
      `${this.api}/${id}/baja`,
      {}
    );
  }

  eliminarPublicacion(id:string){
    return this.http.delete(`${this.api}/${id}`);
  }

  darLike(id:string){
    return this.http.post(`${this.api}/${id}/like`,{});
  }

  quitarLike(id:string){
    return this.http.delete(`${this.api}/${id}/like`);
  }
}
