export interface Usuario {
  _id?: string;
  nombre: string;
  apellido: string;
  email: string;
  nombreUsuario: string;
  fechaNacimiento: Date;
  descripcion: string;
  imagenPerfil: string;
  perfil: string;
  activo: boolean;
}