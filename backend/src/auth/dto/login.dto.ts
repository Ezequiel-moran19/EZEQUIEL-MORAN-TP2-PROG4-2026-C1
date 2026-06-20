import { IsNotEmpty } from "class-validator";

export class LoginDto {
  @IsNotEmpty()
  readonly usuario!: string;

  @IsNotEmpty()
  readonly password!: string;
}