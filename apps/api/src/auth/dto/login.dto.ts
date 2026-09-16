import { IsEmail, IsNotEmpty, IsString } from "class-validator";

const INVALID = "E-mail ou senha inválidos.";

export class LoginDto {
  @IsEmail({}, { message: INVALID })
  email!: string;

  @IsString({ message: INVALID })
  @IsNotEmpty({ message: INVALID })
  password!: string;
}
