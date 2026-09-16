import { Injectable, UnauthorizedException } from "@nestjs/common";
import { compare } from "bcryptjs";
import { sign, verify, type JwtPayload } from "jsonwebtoken";
import { PrismaService } from "../prisma/prisma.service";
import { toAuthUser, type AuthUser } from "./auth.types";
import type { LoginDto } from "./dto/login.dto";

const INVALID = "E-mail ou senha inválidos.";
const SESSION_HOURS = 8;

@Injectable()
export class AuthService {
  constructor(private readonly prisma: PrismaService) {}

  private get secret() {
    const secret = process.env.JWT_SECRET;
    if (!secret) {
      throw new Error("JWT_SECRET is required.");
    }
    return secret;
  }

  async login(dto: LoginDto): Promise<{ token: string; user: AuthUser }> {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email.trim().toLowerCase() },
    });
    if (!user || !user.active) {
      throw new UnauthorizedException(INVALID);
    }

    const matches = await compare(dto.password, user.passwordHash);
    if (!matches) {
      throw new UnauthorizedException(INVALID);
    }

    const token = sign(
      { sub: user.id, email: user.email, role: user.role },
      this.secret,
      { expiresIn: `${SESSION_HOURS}h` },
    );

    return { token, user: toAuthUser(user) };
  }

  async userFromToken(token: string): Promise<AuthUser> {
    let payload: JwtPayload;
    try {
      payload = verify(token, this.secret) as JwtPayload;
    } catch {
      throw new UnauthorizedException("Sessão inválida ou expirada.");
    }

    const id = typeof payload.sub === "string" ? payload.sub : "";
    if (!id) {
      throw new UnauthorizedException("Sessão inválida ou expirada.");
    }

    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user || !user.active) {
      throw new UnauthorizedException("Sessão inválida ou expirada.");
    }

    return toAuthUser(user);
  }
}
