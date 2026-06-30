import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { PublicacionesService } from '../../services/publicaciones.service';
import { ComentariosService } from '../../services/comentarios.service';
import { Publicacion } from '../../interfaces/publicacion.interface';
import { Comentario } from '../../interfaces/comentario.interface';

@Component({
  selector: 'app-publicacion-detalle',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './publicacion-detalle.html',
  styleUrl: './publicacion-detalle.css',
})
export class PublicacionDetalle implements OnInit {

  private fb = inject(FormBuilder);
  private cdr = inject(ChangeDetectorRef);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  private publicacionesService = inject(PublicacionesService);
  private comentariosService = inject(ComentariosService);
  private authService = inject(AuthService);

  publicacion!: Publicacion;
  comentarios: Comentario[] = [];

  id!: string;
  offset = 0;
  limit = 5;
  hayMas = true;
  usuarioActual: any;
  editandoId: string | null = null;
  mensajeEditado = '';

  formComentario = this.fb.group({ mensaje: ['', Validators.required] });
  formEditar = this.fb.group({ mensaje: ['', Validators.required] });

  ngOnInit() {
    this.usuarioActual = this.authService.obtenerUsuarioLogueado();

    this.id = this.route.snapshot.paramMap.get('id')!;
    this.cargarPublicacion();
    this.cargarComentarios();
  }

  cargarPublicacion() {

    this.publicacionesService
      .obtenerPublicacionId(this.id)
      .subscribe(data => {
        this.publicacion = data;
        this.cdr.detectChanges();

      });
  }

  cargarComentarios() {

    this.comentariosService
      .obtenerComentarios(this.id, this.offset, this.limit)
      .subscribe(data => {

        if (this.offset === 0) {
          this.comentarios = data;

        } else {
          this.comentarios = [...this.comentarios, ...data];

        }

        this.hayMas = data.length === this.limit;
        this.cdr.detectChanges();
      });
  }

  crearComentario() {

    const usuario = this.authService.obtenerUsuarioLogueado();
    if (!usuario) return;

    this.comentariosService
      .crearComentario(this.id, {
        mensaje: this.formComentario.value.mensaje,
        autor: usuario._id
      })
      .subscribe(() => {
        this.formComentario.reset();
        this.offset = 0;
        this.cargarComentarios();

      });
  }

  cargarMas() {
    this.offset += this.limit;
    this.cargarComentarios();
  }

  editar(comentario: Comentario) {

    this.editandoId = comentario._id;

    this.formEditar.patchValue({
      mensaje: comentario.mensaje
    });

  }

  guardarEdicion() {

    if (!this.editandoId) return;

    this.comentariosService
      .editarComentario(
        this.editandoId,
        this.formEditar.value.mensaje!
      )
      .subscribe(() => {

        this.editandoId = null;
        this.formEditar.reset();
        this.cargarComentarios();

      });
  }

  cancelarEdicion() {

    this.editandoId = null;
    this.formEditar.reset();

  }

  volver() {
    this.router.navigate(['/publicaciones']);
  }

}