import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class EstadisticasService {

  private http = inject(HttpClient);
  private api = `${environment.apiUrl}/estadisticas`;

  publicacionesPorUsuario(desde: string, hasta: string) {
    return this.http.get<any[]>(
      `${this.api}/publicaciones-por-usuario?desde=${desde}&hasta=${hasta}`
    );
  }

  comentariosPorFecha(desde: string, hasta: string) {
    return this.http.get<any[]>(
      `${this.api}/comentarios?desde=${desde}&hasta=${hasta}`
    );
  }

  comentariosPorPublicacion(desde: string, hasta: string) {
    return this.http.get<any[]>(
      `${this.api}/comentarios-por-publicacion?desde=${desde}&hasta=${hasta}`
    );
  }

}
