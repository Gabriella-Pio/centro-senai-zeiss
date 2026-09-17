import type { UserRole } from "@/lib/api";

export type ListedUser = {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  active: boolean;
};
