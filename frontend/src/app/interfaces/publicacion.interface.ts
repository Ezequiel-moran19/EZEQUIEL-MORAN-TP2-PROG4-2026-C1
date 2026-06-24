export interface Publicacion {
  _id?: string;
  titulo: string;
  descripcion: string;
  imagen?: string;

  autor: {
    _id: string;
    nombre: string;
    apellido: string;
    nombreUsuario: string;
    imagenPerfil?: string;
  };

  createdAt?: Date;

  likes?: string[];
  cantidadLikes?: number;
  activo?: boolean;
}