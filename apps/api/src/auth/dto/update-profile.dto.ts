import { IsEmail, IsOptional, IsString, MinLength } from "class-validator";

export class UpdateProfileDto {
  @IsOptional()
  @IsString()
  @MinLength(2, { message: "O nome precisa ter pelo menos 2 caracteres." })
  name?: string;

  @IsOptional()
  @IsEmail({}, { message: "Confira o e-mail." })
  email?: string;

  @IsOptional()
  @IsString()
  currentPassword?: string;
}