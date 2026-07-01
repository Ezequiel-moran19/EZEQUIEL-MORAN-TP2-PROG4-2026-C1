import { Component, inject, OnInit, ChangeDetectorRef } from '@angular/core';
import { PublicacionesService } from '../../services/publicaciones.service';
import { Publicacion } from '../../interfaces/publicacion.interface';
import { PostCard } from "../../components/post-card/post-card";
import { PostForm } from "../../components/post-form/post-form";
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-publicaciones',
  standalone: true,
  imports: [PostCard, PostForm],
  templateUrl: './publicaciones.html',
  styleUrl: './publicaciones.css',
})
export class Publicaciones implements OnInit {

  publicaciones: Publicacion[] = [];
  mostrarFormulario = false;
  haySiguiente = true;
  orden = 'fecha';
  pagina = 0;
  limite = 5;

  publicacionesService = inject(PublicacionesService);
  authService = inject(AuthService);
  private cdr = inject(ChangeDetectorRef);

  ngOnInit(): void {
    this.cargarPublicaciones();
  }

  toggleFormulario() {
    this.mostrarFormulario = !this.mostrarFormulario;
  }

  cargarPublicaciones() {

    this.publicacionesService.obtenerPublicaciones(
      this.orden,
      this.pagina * this.limite,
      this.limite + 1
    )
    .subscribe({
      next:(data)=>{

        this.haySiguiente = data.length > this.limite;

        this.publicaciones = data.slice(0, this.limite);

        this.cdr.detectChanges();
      }
    });
  }

  publicacionCreada() {
    this.cargarPublicaciones();
    this.mostrarFormulario = false;
  }

  darLike(id: string) {

    const publicacion = this.publicaciones.find(p => p._id === id);

    if (!publicacion) return;

    if (this.usuarioDioLike(publicacion)) {
      this.publicacionesService
        .quitarLike(id)
        .subscribe(() => this.cargarPublicaciones());

    } else {
      this.publicacionesService
        .darLike(id)
        .subscribe(() => this.cargarPublicaciones());
    }
  }

  usuarioDioLike(publicacion: Publicacion): boolean {
    const usuario = this.authService.obtenerUsuarioLogueado();
    if (!usuario || !publicacion.likes) {
      return false;
    }
    return publicacion.likes.includes(usuario._id!);
  }

  darDeBajaPublicacion(id:string){

    this.publicacionesService
    .darDeBajaPublicacion(id)
    .subscribe(()=>{
      this.cargarPublicaciones();
    });
  }

  cambiarOrden(event: Event) {
    const select = event.target as HTMLSelectElement;

    this.orden = select.value;
    this.pagina = 0; 

    this.cargarPublicaciones();
  }

  siguientePagina(){

    if(!this.haySiguiente) return;
    this.pagina++;
    this.cargarPublicaciones();
  }

  anteriorPagina(){
    if(this.pagina > 0){
      this.pagina--;
      this.cargarPublicaciones();
    }
  }

  editarPublicacion(id:string){
   console.log(id);
  }
}
