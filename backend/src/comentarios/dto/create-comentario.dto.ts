import { IsNotEmpty } from "class-validator";

export class CreateComentarioDto {

 @IsNotEmpty()
 mensaje!: string;

}