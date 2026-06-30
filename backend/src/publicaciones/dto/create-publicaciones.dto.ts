import { IsNotEmpty, IsOptional, IsString } from "class-validator";

export class CreatePublicacionesDto {

    @IsString()
    @IsNotEmpty()
    descripcion!: string;

    @IsOptional()
    @IsString()
    imagen?: string;
}