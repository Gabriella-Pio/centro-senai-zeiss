"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { ArrowUpRight, Bell, Check } from "lucide-react";
import type { UserRole } from "@/lib/api";
import type { DemoNotification } from "@/lib/demo/demo-store-types";
import { markAllNotificationsRead, markNotificationRead } from "@/lib/demo/demo-store";
import { useDemoStore } from "@/lib/use-demo-store";

function notificationActionLabel(href: string) {
  if (href.startsWith("/solicitacoes")) {
    return "Ver solicitações";
  }
  if (href.startsWith("/validacao")) {
    return "Ver validação";
  }
  if (href.startsWith("/registros")) {
    return "Ver registro";
  }
  return "Ver detalhes";
}

function formatNotificationTime(iso: string) {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) {
    return "";
  }
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

function sortNotifications(items: DemoNotification[]) {
  return [...items].sort((a, b) => {
    if (a.read !== b.read) {
      return a.read ? 1 : -1;
    }
    return b.createdAt.localeCompare(a.createdAt);
  });
}

export function NotificationBell({ role }: { role: UserRole }) {
  const { notifications } = useDemoStore();
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  const mine = useMemo(
    () => sortNotifications(notifications.filter((item) => item.roles.includes(role))),
    [notifications, role],
  );
  const unread = mine.filter((item) => !item.read).length;

  useEffect(() => {
    if (!open) {
      return;
    }
    function onPointerDown(event: MouseEvent) {
      if (rootRef.current?.contains(event.target as Node)) {
        return;
      }
      setOpen(false);
    }
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", onPointerDown);
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  function handleOpen() {
    setOpen((current) => !current);
  }

  function handleMarkRead(id: string) {
    markNotificationRead(id);
  }

  function handleGo(item: DemoNotification) {
    markNotificationRead(item.id);
    setOpen(false);
  }

  return (
    <div className="shell-notifications" ref={rootRef}>
      <button
        type="button"
        className="shell__icon-btn shell-notifications__btn"
        aria-expanded={open}
        aria-haspopup="dialog"
        aria-label={unread > 0 ? `${unread} notificações não lidas` : "Notificações"}
        onClick={handleOpen}
      >
        <Bell aria-hidden="true" />
        {unread > 0 ? <span className="shell-notifications__badge">{unread}</span> : null}
      </button>
      {open ? (
        <div className="shell-notifications__panel" role="dialog" aria-label="Notificações">
          <div className="shell-notifications__head">
            <div className="shell-notifications__head-copy">
              <strong>Notificações</strong>
              {unread > 0 ? (
                <span className="shell-notifications__head-meta">{unread} não lidas</span>
              ) : null}
            </div>
            {unread > 0 ? (
              <button
                type="button"
                className="shell-notifications__mark-all"
                onClick={() => markAllNotificationsRead(role)}
              >
                Marcar todas como lidas
              </button>
            ) : null}
          </div>
          {mine.length === 0 ? (
            <p className="shell-notifications__empty">Nenhuma notificação.</p>
          ) : (
            <ul className="shell-notifications__list">
              {mine.map((item) => (
                <li
                  key={item.id}
                  className={
                    item.read
                      ? "shell-notifications__item shell-notifications__item--read"
                      : "shell-notifications__item"
                  }
                >
                  <div className="shell-notifications__item-main">
                    <span
                      className="shell-notifications__status-dot"
                      aria-hidden="true"
                      data-read={item.read}
                    />
                    <div className="shell-notifications__item-copy">
                      <p className="shell-notifications__message">{item.message}</p>
                      {item.createdAt ? (
                        <time className="shell-notifications__time" dateTime={item.createdAt}>
                          {formatNotificationTime(item.createdAt)}
                        </time>
                      ) : null}
                    </div>
                  </div>
                  <div className="shell-notifications__item-actions">
                    <Link
                      href={item.href}
                      className="shell-notifications__action shell-notifications__action--go"
                      title={notificationActionLabel(item.href)}
                      onClick={() => handleGo(item)}
                    >
                      <ArrowUpRight aria-hidden="true" />
                      <span>{notificationActionLabel(item.href)}</span>
                    </Link>
                    {!item.read ? (
                      <button
                        type="button"
                        className="shell-notifications__action shell-notifications__action--read"
                        title="Marcar como lida"
                        aria-label="Marcar como lida"
                        onClick={() => handleMarkRead(item.id)}
                      >
                        <Check aria-hidden="true" />
                        <span className="sr-only">Marcar como lida</span>
                      </button>
                    ) : null}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      ) : null}
    </div>
  );
}
