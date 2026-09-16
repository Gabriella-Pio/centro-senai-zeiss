import { ROLE_LABELS, type AuthUser } from "@/lib/api";
import { AppBrand } from "./AppBrand";
import { LogoutButton } from "./LogoutButton";

export function AppHeader({ user }: { user: AuthUser }) {
  return (
    <header className="border-b border-border bg-card">
      <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-5 py-4">
        <AppBrand href="/" variant="footer" />
        <div className="flex items-center gap-4">
          <div className="text-right">
            <p className="text-sm font-medium text-foreground">{user.name}</p>
            <p className="text-xs text-muted-foreground">{ROLE_LABELS[user.role]}</p>
          </div>
          <LogoutButton />
        </div>
      </div>
    </header>
  );
}
