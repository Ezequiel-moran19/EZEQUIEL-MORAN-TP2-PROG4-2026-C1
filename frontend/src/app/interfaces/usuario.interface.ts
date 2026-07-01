export interface Usuario {
  _id:string;
  nombre:string;
  apellido:string;
  email:string;
  nombreUsuario:string;
  password?:string;
  fechaNacimiento?:Date;
  descripcion?:string;
  imagenPerfil?:string;
  perfil:'usuario' | 'administrador';
  activo:boolean;
}