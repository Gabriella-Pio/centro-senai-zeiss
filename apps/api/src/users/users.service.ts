import { ConflictException, ForbiddenException, Injectable, NotFoundException } from "@nestjs/common";
import { hashSync } from "bcryptjs";
import { PrismaService } from "../prisma/prisma.service";
import type { AuthUser } from "../auth/auth.types";
import type { CreateUserDto } from "./dto/create-user.dto";
import type { UpdateUserDto } from "./dto/update-user.dto";

const publicUser = {
  id: true,
  email: true,
  name: true,
  role: true,
  active: true,
  createdAt: true,
} as const;

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  list() {
    return this.prisma.user.findMany({
      select: publicUser,
      orderBy: [{ role: "asc" }, { name: "asc" }],
    });
  }

  async create(dto: CreateUserDto, actor: AuthUser) {
    const email = dto.email.trim().toLowerCase();
    const existing = await this.prisma.user.findUnique({ where: { email } });
    if (existing) {
      throw new ConflictException("Já existe uma conta com este e-mail.");
    }

    const created = await this.prisma.user.create({
      data: {
        name: dto.name.trim(),
        email,
        passwordHash: hashSync(dto.password, 10),
        mustChangePassword: true,
        role: dto.role,
        active: true,
      },
      select: publicUser,
    });
    await this.prisma.userAuditLog.create({
      data: { actorId: actor.id, targetId: created.id, action: "USER_CREATED" },
    });
    return created;
  }

  async update(id: string, dto: UpdateUserDto, actor: AuthUser) {
    const target = await this.prisma.user.findUnique({ where: { id } });
    if (!target) {
      throw new NotFoundException("Conta não encontrada.");
    }

    const active = dto.active ?? target.active;
    const role = dto.role ?? target.role;
    if (id === actor.id && !active) {
      throw new ForbiddenException("Você não pode desativar a própria conta.");
    }
    if (id === actor.id && role !== "ADMIN") {
      throw new ForbiddenException("Você não pode remover o próprio acesso de administrador.");
    }
    if (target.role === "ADMIN" && target.active && (!active || role !== "ADMIN")) {
      const activeAdmins = await this.prisma.user.count({ where: { role: "ADMIN", active: true } });
      if (activeAdmins <= 1) {
        throw new ForbiddenException("É preciso manter pelo menos um administrador ativo.");
      }
    }

    const email = dto.email?.trim().toLowerCase();
    if (email && email !== target.email) {
      const existing = await this.prisma.user.findUnique({ where: { email } });
      if (existing) {
        throw new ConflictException("Já existe uma conta com este e-mail.");
      }
    }

    const updated = await this.prisma.user.update({
      where: { id },
      data: {
        ...(dto.name === undefined ? {} : { name: dto.name.trim() }),
        ...(email === undefined ? {} : { email }),
        ...(dto.role === undefined ? {} : { role: dto.role }),
        ...(dto.active === undefined ? {} : { active: dto.active }),
        ...(dto.password === undefined ? {} : { passwordHash: hashSync(dto.password, 10) }),
        ...(dto.password === undefined ? {} : { mustChangePassword: true }),
      },
      select: publicUser,
    });
    await this.prisma.userAuditLog.create({
      data: {
        actorId: actor.id,
        targetId: id,
        action: "USER_UPDATED",
        details: JSON.stringify({ active: dto.active, role: dto.role, passwordChanged: dto.password !== undefined }),
      },
    });
    return updated;
  }
}
