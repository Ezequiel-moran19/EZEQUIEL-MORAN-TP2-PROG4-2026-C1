import { IsEmail, IsString, IsOptional, IsIn } from 'class-validator';

export class CreateUsuarioAdminDto {

  @IsString()
  nombre!:string;

  @IsString()
  apellido!:string;

  @IsEmail()
  email!:string;

  @IsString()
  nombreUsuario!:string;

  @IsString()
  password!:string;

  @IsOptional()
  descripcion?:string;

  @IsOptional()
  fechaNacimiento?:Date;

  @IsIn(['usuario','administrador'])
  perfil!: string;
}