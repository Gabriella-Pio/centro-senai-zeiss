import { UserRole } from "../../../generated/prisma/client";
import { IsEmail, IsEnum, IsString, MinLength } from "class-validator";

export class CreateUserDto {
  @IsString()
  @MinLength(2, { message: "O nome precisa ter pelo menos 2 caracteres." })
  name!: string;

  @IsEmail({}, { message: "Confira o e-mail." })
  email!: string;

  @IsString()
  @MinLength(8, { message: "A senha precisa ter pelo menos 8 caracteres." })
  password!: string;

  @IsEnum(UserRole, { message: "Escolha um papel." })
  role!: UserRole;
}
