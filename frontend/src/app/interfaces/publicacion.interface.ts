export interface Publicacion {
  _id?: string;
  titulo: string;
  descripcion: string;
  imagen?: string;
  autorId: string;
  autorNombre?: string;
  autorApellido?: string;
  autorImagen?: string;
  fechaCreacion?: Date;
  likes?: string[];
  activo?: boolean;
}