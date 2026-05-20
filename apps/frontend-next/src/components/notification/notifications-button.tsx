"use client";

import { Bell } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { useNotificationsPanelStore } from "@/store/use-notifications-panel-store";
import { useUnreadNotificationsCount } from "@/hooks/notification/use-unread-notifications-count";

export const NotificationsButton = () => {
  const { toggle, isOpen } = useNotificationsPanelStore();
  const { count } = useUnreadNotificationsCount();

  return (
    <button
      type="button"
      onClick={toggle}
      className={cn(
        "flex w-full items-center justify-between rounded-lg px-3 py-2 transition-all hover:bg-slate-800",
        isOpen ? "bg-slate-800 text-white" : "text-slate-400"
      )}
    >
      <span className="flex items-center gap-3">
        <Bell className="h-5 w-5" />
        <span>Notifications</span>
      </span>

      {count > 0 && (
        <span className="min-w-5 rounded-full bg-sky-500 px-2 py-0.5 text-xs font-semibold text-white">
          {count > 99 ? "99+" : count}
        </span>
      )}
    </button>
  );
};
