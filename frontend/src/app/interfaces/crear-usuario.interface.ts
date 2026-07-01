export interface CrearUsuarioDto {
  nombre: string;
  apellido: string;
  email: string;
  nombreUsuario: string;
  password: string;
  perfil: 'usuario' | 'administrador';
}