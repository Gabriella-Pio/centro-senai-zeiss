import { redirect } from "next/navigation";
import { AppBrand } from "@/components/AppBrand";
import { getSessionUser } from "@/lib/session";
import { LoginForm } from "./LoginForm";
import "./login.css";

export default async function LoginPage() {
  const user = await getSessionUser();
  if (user) {
    redirect("/");
  }

  return (
    <main className="login-shell">
      <section className="login-panel">
        <div className="login-card">
          <AppBrand variant="nav" />
          <h1 className="mt-8 font-heading text-3xl font-semibold tracking-tight text-foreground">
            Área da equipe
          </h1>
          <p className="mt-2 text-base text-muted-foreground">
            Entre com o e-mail e a senha da sua conta.
          </p>
          <LoginForm />
        </div>
      </section>
      <aside className="login-visual" aria-hidden="true">
        <div className="login-visual__veil" />
      </aside>
    </main>
  );
}
