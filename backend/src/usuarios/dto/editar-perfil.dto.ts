import { IsOptional, IsString } from 'class-validator';

export class EditarPerfilDto {

  @IsOptional()
  @IsString()
  nombre?: string;

  @IsOptional()
  @IsString()
  apellido?: string;

  @IsOptional()
  @IsString()
  descripcion?: string;
}