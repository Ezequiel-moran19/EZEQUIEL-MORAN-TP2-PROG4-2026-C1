export interface UsuarioRegistro {
  nombre: string;
  apellido: string;
  email: string;
  nombreUsuario: string;
  password: string;
  repetirPassword: string;
  fechaNacimiento: string;
  descripcion: string;
  imagenPerfil: File | null;
  perfil: 'usuario' | 'administrador';
}