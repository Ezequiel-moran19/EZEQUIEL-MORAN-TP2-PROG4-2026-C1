import { PartialType } from '@nestjs/mapped-types';
import { CreateComentarioDto } from './create-comentario.dto';
import { IsNotEmpty } from 'class-validator';

export class UpdateComentarioDto extends PartialType(CreateComentarioDto) {
    @IsNotEmpty()
    mensaje!: string;
}
