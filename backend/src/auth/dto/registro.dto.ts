import { IsEmail, IsNotEmpty, IsString, Matches, MinLength, IsOptional } from 'class-validator';

export class RegistroDto {

  @IsString()
  @IsNotEmpty()
  nombre!: string;

  @IsString()
  @IsNotEmpty()
  apellido!: string;

  @IsEmail()
  email!: string;

  @IsString()
  @IsNotEmpty()
  nombreUsuario!: string;

  @Matches(/^(?=.*[A-Z])(?=.*\d).{8,}$/)
  @MinLength(8)
  password!: string;

  @Matches(/^(?=.*[A-Z])(?=.*\d).{8,}$/)
  @MinLength(8)
  repetirPassword!: string;

  @IsNotEmpty()
  fechaNacimiento!: Date;

  @IsString()
  @IsNotEmpty()
  descripcion!: string;

  @IsOptional()
  imagenPerfil?: string;
}

  // @IsOptional()
  // perfil?: string;