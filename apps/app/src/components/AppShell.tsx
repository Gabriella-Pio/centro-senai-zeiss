"use client";

import { useEffect, useState, type ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BookOpen,
  ChartColumn,
  ClipboardList,
  FlaskConical,
  House,
  Menu,
  PanelLeftClose,
  PanelLeftOpen,
  ShieldCheck,
  Sparkles,
  Users,
  UserRound,
  X,
} from "lucide-react";
import { ROLE_LABELS, type AuthUser } from "@/lib/api";
import { navForRole, type NavIcon } from "@/lib/nav";
import { AppBrand } from "./AppBrand";
import { LogoutButton } from "./LogoutButton";
import "./app-shell.css";

const NAV_ICONS: Record<NavIcon, typeof House> = {
  home: House,
  assistant: Sparkles,
  records: ClipboardList,
  vocab: BookOpen,
  validation: ShieldCheck,
  indicators: ChartColumn,
  demo: FlaskConical,
  users: Users,
  profile: UserRound,
};

const COLLAPSE_KEY = "cem_sidebar_collapsed";

function pathMatches(href: string, pathname: string) {
  if (href === "/") {
    return pathname === "/";
  }
  return pathname === href || pathname.startsWith(`${href}/`);
}

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

function NavGroupList({
  label,
  items,
  pathname,
  onNavigate,
}: {
  label: string;
  items: ReturnType<typeof navForRole>;
  pathname: string;
  onNavigate: () => void;
}) {
  if (items.length === 0) {
    return null;
  }

  return (
    <div className="shell__group">
      <p className="shell__group-label">{label}</p>
      {items.map((item) => {
        const Icon = NAV_ICONS[item.icon];
        const current = Boolean(item.ready) && pathMatches(item.href, pathname);
        const body = (
          <>
            <span className="shell__link-glyph" aria-hidden="true">
              <Icon className="shell__link-icon" />
            </span>
            <span className="shell__link-label">{item.label}</span>
            {item.ready ? null : <span className="shell__soon">em breve</span>}
          </>
        );
        if (!item.ready) {
          return (
            <span
              key={item.href}
              className="shell__link shell__link--soon"
              aria-disabled="true"
              title={`${item.label} — em breve`}
            >
              {body}
            </span>
          );
        }
        return (
          <Link
            key={item.href}
            href={item.href}
            className="shell__link"
            aria-current={current ? "page" : undefined}
            title={item.label}
            onClick={onNavigate}
          >
            {body}
          </Link>
        );
      })}
    </div>
  );
}

export function AppShell({ user, children }: { user: AuthUser; children: ReactNode }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const items = navForRole(user.role);
  const workItems = items.filter((item) => item.group === "work");
  const manageItems = items.filter((item) => item.group === "manage");
  const roleLabel = ROLE_LABELS[user.role];
  const showRole = user.name.trim().toLocaleLowerCase("pt-BR") !== roleLabel.toLocaleLowerCase("pt-BR");

  useEffect(() => {
    setCollapsed(window.localStorage.getItem(COLLAPSE_KEY) === "1");
  }, []);

  useEffect(() => {
    if (!open) {
      return;
    }
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpen(false);
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  function toggleCollapsed() {
    setCollapsed((current) => {
      const next = !current;
      window.localStorage.setItem(COLLAPSE_KEY, next ? "1" : "0");
      return next;
    });
  }

  return (
    <div className="shell" data-collapsed={collapsed}>
      <div className="shell__bar">
        <AppBrand href="/" variant="footer" />
        <button
          type="button"
          className="shell__icon-btn"
          aria-expanded={open}
          aria-controls="app-sidebar"
          onClick={() => setOpen(true)}
        >
          <Menu aria-hidden="true" />
          <span className="sr-only">Abrir menu</span>
        </button>
      </div>

      {open ? (
        <button
          type="button"
          className="shell__backdrop"
          aria-label="Fechar menu"
          onClick={() => setOpen(false)}
        />
      ) : null}

      <aside id="app-sidebar" className="shell__sidebar" data-open={open}>
        <div className="shell__sidebar-header">
          <AppBrand href="/" variant="nav" />
          <button
            type="button"
            className="shell__icon-btn shell__close"
            onClick={() => setOpen(false)}
          >
            <X aria-hidden="true" />
            <span className="sr-only">Fechar menu</span>
          </button>
          <button
            type="button"
            className="shell__collapse"
            onClick={toggleCollapsed}
            aria-pressed={collapsed}
            title={collapsed ? "Expandir menu" : "Minimizar menu"}
          >
            {collapsed ? <PanelLeftOpen aria-hidden="true" /> : <PanelLeftClose aria-hidden="true" />}
            <span className="sr-only">{collapsed ? "Expandir menu" : "Minimizar menu"}</span>
          </button>
        </div>
        <nav className="shell__nav" aria-label="Seções da área da equipe">
          <NavGroupList
            label="Trabalho"
            items={workItems}
            pathname={pathname}
            onNavigate={() => setOpen(false)}
          />
          <NavGroupList
            label="Gestão"
            items={manageItems}
            pathname={pathname}
            onNavigate={() => setOpen(false)}
          />
        </nav>
        <div className="shell__footer">
          <div className="shell__who" title={`${user.name} · ${roleLabel}`}>
            <span className="shell__avatar">{initialsOf(user.name)}</span>
            <div className="shell__who-text">
              <p className="shell__who-name">{user.name}</p>
              {showRole ? <p className="shell__who-role">{roleLabel}</p> : null}
            </div>
          </div>
          <LogoutButton className="shell__logout" compact={collapsed} />
        </div>
      </aside>

      <div className="shell__main">
        <div className="shell__content">{children}</div>
      </div>
    </div>
  );
}
