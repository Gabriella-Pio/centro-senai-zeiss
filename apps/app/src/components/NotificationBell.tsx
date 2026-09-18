"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Bell } from "lucide-react";
import type { UserRole } from "@/lib/api";
import { markAllNotificationsRead, markNotificationRead } from "@/lib/demo-store";
import { useDemoStore } from "@/lib/use-demo-store";

export function NotificationBell({ role }: { role: UserRole }) {
  const { notifications } = useDemoStore();
  const [open, setOpen] = useState(false);

  const mine = useMemo(
    () => notifications.filter((item) => item.roles.includes(role)),
    [notifications, role],
  );
  const unread = mine.filter((item) => !item.read).length;

  return (
    <div className="shell-notifications">
      <button
        type="button"
        className="shell__icon-btn shell-notifications__btn"
        aria-expanded={open}
        aria-label={unread > 0 ? `${unread} notificações não lidas` : "Notificações"}
        onClick={() => setOpen((current) => !current)}
      >
        <Bell aria-hidden="true" />
        {unread > 0 ? <span className="shell-notifications__badge">{unread}</span> : null}
      </button>
      {open ? (
        <div className="shell-notifications__panel">
          <div className="shell-notifications__head">
            <strong>Notificações</strong>
            {unread > 0 ? (
              <button type="button" onClick={() => markAllNotificationsRead(role)}>Marcar todas como lidas</button>
            ) : null}
          </div>
          {mine.length === 0 ? <p className="shell-notifications__empty">Nenhuma notificação.</p> : (
            <ul>
              {mine.map((item) => (
                <li key={item.id} className={item.read ? "shell-notifications__item shell-notifications__item--read" : "shell-notifications__item"}>
                  <Link href={item.href} onClick={() => { markNotificationRead(item.id); setOpen(false); }}>
                    {item.message}
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      ) : null}
    </div>
  );
}
