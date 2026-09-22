"use client";

import { useMemo, useState, useSyncExternalStore } from "react";
import { FilterX, Pencil, Plus, Search, UsersRound } from "lucide-react";
import {
  Badge,
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  Input,
  Label,
} from "@cem/ui";
import { ROLE_LABELS, type UserRole } from "@/lib/api";
import { CreateUserForm } from "./CreateUserForm";
import { EditUserForm } from "./EditUserForm";
import type { ListedUser } from "./types";
import { DEMO_USERS_KEY } from "@/lib/demo/demo";
import "./users.css";

const ROLES: UserRole[] = ["CONSULTA", "TECNICO", "VALIDADOR", "ADMIN"];

function initialsOf(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) {
    return "?";
  }
  if (parts.length === 1) {
    return parts[0].slice(0, 2).toUpperCase();
  }
  return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
}

export function UsersBoard({
  people,
  currentUserId,
}: {
  people: ListedUser[];
  currentUserId: string;
}) {
  const storedPeople = useSyncExternalStore(
    (onStoreChange) => {
      window.addEventListener("storage", onStoreChange);
      window.addEventListener("cem-demo-users-changed", onStoreChange);
      return () => {
        window.removeEventListener("storage", onStoreChange);
        window.removeEventListener("cem-demo-users-changed", onStoreChange);
      };
    },
    () => window.localStorage.getItem(DEMO_USERS_KEY) ?? "",
    () => "",
  );
  const listedPeople = useMemo(() => {
    if (!storedPeople) {
      return people;
    }
    try {
      return JSON.parse(storedPeople) as ListedUser[];
    } catch {
      return people;
    }
  }, [people, storedPeople]);
  const [creating, setCreating] = useState(false);
  const [editing, setEditing] = useState<ListedUser | null>(null);
  const [query, setQuery] = useState("");
  const [role, setRole] = useState<"ALL" | UserRole>("ALL");
  const [status, setStatus] = useState<"ALL" | "ACTIVE" | "INACTIVE">("ALL");
  const [notice, setNotice] = useState<string | null>(null);

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return listedPeople.filter((person) => {
      if (role !== "ALL" && person.role !== role) {
        return false;
      }
      if (status === "ACTIVE" && !person.active) {
        return false;
      }
      if (status === "INACTIVE" && person.active) {
        return false;
      }
      if (!needle) {
        return true;
      }
      return person.name.toLowerCase().includes(needle) || person.email.toLowerCase().includes(needle);
    });
  }, [listedPeople, query, role, status]);

  const filtering = query.trim() !== "" || role !== "ALL" || status !== "ALL";
  const accountWord = listedPeople.length === 1 ? "conta" : "contas";
  const activeCount = listedPeople.filter((person) => person.active).length;

  function clearFilters() {
    setQuery("");
    setRole("ALL");
    setStatus("ALL");
  }

  return (
    <div className="users-board">
      <div className="users-board__header">
        <div>
          <p className="users-board__eyebrow">Administração da equipe</p>
          <h1 className="users-board__title">Equipe e acessos</h1>
          <p className="users-board__intro">
            Gerencie as contas da equipe e defina o que cada pessoa pode fazer no laboratório.
          </p>
        </div>
      </div>

      <div className="users-board__summary">
        <div className="users-board__summary-stats">
          <div className="users-board__stat">
            <div className="users-board__stat-icon" aria-hidden="true">
              <UsersRound />
            </div>
            <div>
              <p className="users-board__stat-value">{listedPeople.length}</p>
              <p className="users-board__stat-label">{accountWord} cadastradas</p>
            </div>
          </div>
          <div className="users-board__active-stat">
            <span className="users-board__active-dot" aria-hidden="true" />
            <div>
              <p className="users-board__active-value">{activeCount}</p>
              <p className="users-board__active-label">ativas agora</p>
            </div>
          </div>
        </div>
        <Button
          type="button"
          size="lg"
          className="users-board__create-button"
          onClick={() => setCreating(true)}
        >
          <Plus aria-hidden="true" />
          Nova conta
        </Button>
      </div>

      <section className="mt-8" aria-labelledby="users-list-heading">
        <h2 id="users-list-heading" className="sr-only">
          Contas
        </h2>
        <div className="users-board__toolbar">
          <div className="users-board__search">
            <Search className="users-board__search-icon" aria-hidden="true" />
            <Input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Pesquisar nome ou e-mail"
              aria-label="Pesquisar nome ou e-mail"
              className="h-12 pl-10 text-base"
            />
          </div>
          <div className="users-board__filter">
            <Label htmlFor="users-role-filter" className="sr-only">
              Filtrar por papel
            </Label>
            <select
              id="users-role-filter"
              value={role}
              onChange={(event) => setRole(event.target.value as "ALL" | UserRole)}
              className="h-12 w-full rounded-(--radius) border border-input bg-card px-3 text-base text-foreground outline-none focus-visible:border-ring focus-visible:ring-1 focus-visible:ring-ring/50"
            >
              <option value="ALL">Todos os papéis</option>
              {ROLES.map((value) => (
                <option key={value} value={value}>
                  {ROLE_LABELS[value]}
                </option>
              ))}
            </select>
          </div>
          <div className="users-board__filter">
            <Label htmlFor="users-status-filter" className="sr-only">
              Filtrar por situação
            </Label>
            <select
              id="users-status-filter"
              value={status}
              onChange={(event) => setStatus(event.target.value as "ALL" | "ACTIVE" | "INACTIVE")}
              className="h-12 w-full rounded-(--radius) border border-input bg-card px-3 text-base text-foreground outline-none focus-visible:border-ring focus-visible:ring-1 focus-visible:ring-ring/50"
            >
              <option value="ALL">Todas as situações</option>
              <option value="ACTIVE">Ativas</option>
              <option value="INACTIVE">Inativas</option>
            </select>
          </div>
          {filtering ? (
            <div className="users-board__filter-summary">
              <p className="users-board__count">
                {filtered.length === 1 ? "1 encontrada" : `${filtered.length} encontradas`}
              </p>
              <Button type="button" variant="ghost" size="sm" onClick={clearFilters}>
                <FilterX aria-hidden="true" />
                Limpar filtros
              </Button>
            </div>
          ) : null}
        </div>

        {notice ? (
          <p className="users-board__notice" role="status">
            {notice}
          </p>
        ) : null}

        <div className="mt-4 overflow-x-auto rounded-(--radius) border border-border bg-card shadow-[0_8px_24px_rgba(28,25,23,0.05)]">
          {filtered.length === 0 ? (
            <div className="users-board__empty">
              <FilterX aria-hidden="true" />
              <p>Nenhuma conta encontrada com esses filtros.</p>
              {filtering ? (
                <Button type="button" variant="outline" size="lg" onClick={clearFilters}>
                  Limpar filtros
                </Button>
              ) : null}
            </div>
          ) : (
            <table className="w-full min-w-160 text-left text-base">
              <thead className="border-b border-border bg-muted/70 text-sm text-muted-foreground">
                <tr>
                  <th className="px-5 py-3 font-medium">Pessoa</th>
                  <th className="px-5 py-3 font-medium">Papel</th>
                  <th className="px-5 py-3 font-medium">Situação</th>
                  <th className="px-5 py-3 text-right font-medium">Ações</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((person) => {
                  const isYou = person.id === currentUserId;
                  return (
                    <tr key={person.id} className="border-b border-border last:border-b-0 hover:bg-muted/50">
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <span className="inline-flex size-9 shrink-0 items-center justify-center rounded-(--radius) bg-primary text-xs font-bold tracking-wide text-primary-foreground">
                            {initialsOf(person.name)}
                          </span>
                          <div className="min-w-0">
                            <p className="font-medium text-foreground">
                              {person.name}
                              {isYou ? (
                                <span className="ml-2 text-sm font-normal text-muted-foreground">você</span>
                              ) : null}
                            </p>
                            <p className="truncate text-sm text-muted-foreground">{person.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <Badge variant={person.role === "ADMIN" ? "default" : "outline"}>
                          {ROLE_LABELS[person.role]}
                        </Badge>
                      </td>
                      <td className="px-5 py-4 text-sm">
                        {person.active ? (
                          <span className="users-board__status users-board__status--active">Ativa</span>
                        ) : (
                          <span className="users-board__status users-board__status--inactive">Inativa</span>
                        )}
                      </td>
                      <td className="px-5 py-4 text-right">
                        <Button type="button" variant="ghost" size="icon-sm" title={`Editar ${person.name}`} onClick={() => setEditing(person)}>
                          <Pencil aria-hidden="true" />
                          <span className="sr-only">Editar {person.name}</span>
                        </Button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </section>

      <Dialog open={creating} onOpenChange={setCreating}>
        <DialogContent
          className="max-h-[90svh] gap-5 overflow-y-auto p-6 sm:max-w-xl"
        >
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold">Adicionar pessoa à equipe</DialogTitle>
            <DialogDescription className="text-base text-muted-foreground">
              Crie a conta, defina o papel e compartilhe o e-mail e a senha inicial com a pessoa.
            </DialogDescription>
          </DialogHeader>
          {creating ? (
            <CreateUserForm
              onCancel={() => setCreating(false)}
              onCreated={() => {
                setCreating(false);
                setNotice("Conta criada. A pessoa já pode acessar com o e-mail e a senha inicial.");
              }}
            />
          ) : null}
        </DialogContent>
      </Dialog>

      <Dialog open={editing !== null} onOpenChange={(open) => !open && setEditing(null)}>
        <DialogContent className="max-h-[90svh] gap-5 overflow-y-auto p-6 sm:max-w-xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold">Editar conta</DialogTitle>
            <DialogDescription className="text-base text-muted-foreground">
              Atualize os dados, o papel ou a situação desta conta.
            </DialogDescription>
          </DialogHeader>
          {editing ? <EditUserForm user={editing} onCancel={() => setEditing(null)} onSaved={() => { setEditing(null); setNotice("Conta atualizada com sucesso."); }} /> : null}
        </DialogContent>
      </Dialog>
    </div>
  );
}
