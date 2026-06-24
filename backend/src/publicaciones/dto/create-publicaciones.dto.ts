import { IsNotEmpty, IsOptional, IsString } from "class-validator";

export class CreatePublicacionesDto {

    @IsString()
    @IsNotEmpty()
    titulo!: string;

    @IsString()
    @IsNotEmpty()
    descripcion!: string;

    @IsOptional()
    @IsString()
    imagen?: string;

    @IsString()
    @IsNotEmpty()
    autor!: string;
}