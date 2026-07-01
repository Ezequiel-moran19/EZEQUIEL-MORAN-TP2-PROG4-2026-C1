import { Component, inject } from '@angular/core';
import { Chart, BarController, BarElement, CategoryScale, LinearScale, Title, Tooltip, Legend, LineController, LineElement, PointElement, PieController, ArcElement } from 'chart.js';
import { EstadisticasService } from '../../../services/estadisticas.service';

Chart.register( BarController, BarElement, CategoryScale, LinearScale, Title, Tooltip, Legend, LineController, LineElement, PointElement, PieController, ArcElement );

@Component({
  selector: 'app-estadisticas',
  standalone: true,
  templateUrl: './estadisticas.html',
  styleUrl: './estadisticas.css'
})
export class Estadisticas {

  private estadisticasService = inject(EstadisticasService);

  desde = '';
  hasta = '';

  cargarGraficos() {

    this.estadisticasService
      .publicacionesPorUsuario(this.desde, this.hasta)
      .subscribe(data => {
        Chart.getChart('graficoUsuarios')?.destroy();
        new Chart('graficoUsuarios', {
          type: 'bar',
          data: {
            labels: data.map(x => x.usuario),
            datasets:[{
            label:'Publicaciones por usuario',
            data:data.map(x=>x.cantidad),
            backgroundColor:'#2563eb'
            }]
          }
        });
      });

    this.estadisticasService
      .comentariosPorFecha(this.desde, this.hasta)
      .subscribe(data => {
        Chart.getChart('graficoComentarios')?.destroy();
        new Chart('graficoComentarios', {

          type: 'line',
          data: {
            labels: data.map(x => x._id),
            datasets: [{
              label: 'Comentarios por fecha',
              data: data.map(x => x.cantidad),
              backgroundColor:'#f17a12'
            }]
          }
        });
      });

    this.estadisticasService
      .comentariosPorPublicacion(this.desde, this.hasta)
      .subscribe(data => {
        Chart.getChart('graficoPublicaciones')?.destroy();
        new Chart('graficoPublicaciones', {
          type: 'pie',
          data: {
            labels: data.map(x => x.publicacion),
            datasets: [{
              label: 'Comentarios',
              data: data.map(x => x.cantidad),
              backgroundColor:'#089a1e'
            }]
          }
        });
      });
  }
}