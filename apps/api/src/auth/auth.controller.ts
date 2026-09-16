import { Body, Controller, Get, Post, Res, UseGuards } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import type { FastifyReply } from "fastify";
import { AuthGuard, SESSION_COOKIE } from "./auth.guard";
import { AuthService } from "./auth.service";
import { CurrentUser } from "./current-user.decorator";
import type { AuthUser } from "./auth.types";
import { LoginDto } from "./dto/login.dto";

const COOKIE_MAX_AGE = 60 * 60 * 8;

function cookieReply(reply: FastifyReply) {
  return reply as FastifyReply & {
    setCookie: (name: string, value: string, options: Record<string, unknown>) => void;
    clearCookie: (name: string, options: Record<string, unknown>) => void;
  };
}

function cookieOptions() {
  return {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: COOKIE_MAX_AGE,
    secure: process.env.NODE_ENV === "production",
  };
}

@ApiTags("Auth")
@Controller("auth")
export class AuthController {
  constructor(private readonly auth: AuthService) {}

  @Post("login")
  async login(@Body() dto: LoginDto, @Res({ passthrough: true }) reply: FastifyReply) {
    const { token, user } = await this.auth.login(dto);
    cookieReply(reply).setCookie(SESSION_COOKIE, token, cookieOptions());
    return { user };
  }

  @Post("logout")
  logout(@Res({ passthrough: true }) reply: FastifyReply) {
    cookieReply(reply).clearCookie(SESSION_COOKIE, { path: "/" });
    return { ok: true };
  }

  @Get("me")
  @UseGuards(AuthGuard)
  me(@CurrentUser() user: AuthUser) {
    return { user };
  }
}
