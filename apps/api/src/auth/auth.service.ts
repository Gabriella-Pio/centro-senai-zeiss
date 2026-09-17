import { ConflictException, Injectable, UnauthorizedException } from "@nestjs/common";
import { compare, hash } from "bcryptjs";
import { sign, verify, type JwtPayload } from "jsonwebtoken";
import { PrismaService } from "../prisma/prisma.service";
import { toAuthUser, type AuthUser } from "./auth.types";
import type { LoginDto } from "./dto/login.dto";
import type { ChangePasswordDto } from "./dto/change-password.dto";
import type { UpdateProfileDto } from "./dto/update-profile.dto";

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

  async updateProfile(user: AuthUser, dto: UpdateProfileDto) {
    const current = await this.prisma.user.findUnique({ where: { id: user.id } });
    if (!current) {
      throw new UnauthorizedException("Sessão inválida ou expirada.");
    }
    const email = dto.email?.trim().toLowerCase();
    const changesEmail = email !== undefined && email !== current.email;
    if (changesEmail) {
      if (!dto.currentPassword || !(await compare(dto.currentPassword, current.passwordHash))) {
        throw new UnauthorizedException("Informe a senha atual para alterar o e-mail.");
      }
      const existing = await this.prisma.user.findUnique({ where: { email } });
      if (existing && existing.id !== user.id) {
        throw new ConflictException("Já existe uma conta com este e-mail.");
      }
    }
    const updated = await this.prisma.user.update({
      where: { id: user.id },
      data: {
        ...(dto.name === undefined ? {} : { name: dto.name.trim() }),
        ...(email === undefined ? {} : { email }),
        ...(dto.currentPassword === undefined ? {} : { mustChangePassword: false }),
      },
    });
    await this.prisma.userAuditLog.create({
      data: { actorId: user.id, targetId: user.id, action: "PROFILE_UPDATED" },
    });
    return { user: toAuthUser(updated) };
  }

  async changePassword(user: AuthUser, dto: ChangePasswordDto) {
    const current = await this.prisma.user.findUnique({ where: { id: user.id } });
    if (!current || !(await compare(dto.currentPassword, current.passwordHash))) {
      throw new UnauthorizedException("A senha atual está incorreta.");
    }
    await this.prisma.user.update({
      where: { id: user.id },
      data: { passwordHash: await hash(dto.newPassword, 10), mustChangePassword: false },
    });
    await this.prisma.userAuditLog.create({
      data: { actorId: user.id, targetId: user.id, action: "PASSWORD_CHANGED" },
    });
    return { ok: true };
  }
}
