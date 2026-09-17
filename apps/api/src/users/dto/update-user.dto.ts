import { UserRole } from "../../../generated/prisma/client";
import { IsBoolean, IsEmail, IsEnum, IsOptional, IsString, MinLength } from "class-validator";

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  @MinLength(2, { message: "O nome precisa ter pelo menos 2 caracteres." })
  name?: string;

  @IsOptional()
  @IsEmail({}, { message: "Confira o e-mail." })
  email?: string;

  @IsOptional()
  @IsEnum(UserRole, { message: "Escolha um papel." })
  role?: UserRole;

  @IsOptional()
  @IsBoolean()
  active?: boolean;

  @IsOptional()
  @IsString()
  @MinLength(8, { message: "A senha precisa ter pelo menos 8 caracteres." })
  password?: string;
}