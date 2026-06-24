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

  crearPublicacion(formData: FormData) {
    return this.http.post(this.api, formData);
  }

  darLike(id: string, usuarioId: string) {
    return this.http.post(`${this.api}/${id}/like`, {
      usuarioId
    });
  }

  quitarLike(id: string, usuarioId: string) {
    return this.http.delete(`${this.api}/${id}/like`, {
      body: { usuarioId }
    });
  }

  eliminarPublicacion( id: string, usuarioId: string, perfil: string ) {
    return this.http.delete(`${this.api}/${id}`, {
      body: {
        usuarioId,
        perfil
      }
    });
  }
}