import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import type { FastifyRequest } from "fastify";
import { AuthService } from "./auth.service";
import type { AuthUser } from "./auth.types";

type AuthedRequest = FastifyRequest & {
  cookies?: Record<string, string>;
  user?: AuthUser;
};

export const SESSION_COOKIE = "cem_session";

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly auth: AuthService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<AuthedRequest>();
    const token = readToken(request);
    if (!token) {
      throw new UnauthorizedException("Faça login para continuar.");
    }
    request.user = await this.auth.userFromToken(token);
    return true;
  }
}

function readToken(request: AuthedRequest): string | undefined {
  const fromCookie = request.cookies?.[SESSION_COOKIE];
  if (fromCookie) {
    return fromCookie;
  }

  const header = request.headers.authorization;
  if (header?.startsWith("Bearer ")) {
    return header.slice("Bearer ".length).trim();
  }

  return undefined;
}
