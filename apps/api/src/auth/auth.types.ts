import type { UserRole } from "../../generated/prisma/client";

export type AuthUser = {
  id: string;
  email: string;
  name: string;
  role: UserRole;
};

export function toAuthUser(user: {
  id: string;
  email: string;
  name: string;
  role: UserRole;
}): AuthUser {
  return {
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
  };
}
