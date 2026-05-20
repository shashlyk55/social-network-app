"use client";

import { useNotificationsPanelStore } from "@/store/use-notifications-panel-store";
import { X } from "lucide-react";
import { NotificationsList } from "../notification/notification-list";
import { useNotifications } from "@/hooks/notification/use-notifications";

export const NotificationsPanel = () => {
  const { isOpen, close } = useNotificationsPanelStore();

  const { data, isLoading, isError } = useNotifications({
    page: 1,
    limit: 20,
  });

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/40">
      <div className="h-full w-full max-w-md border-l border-slate-200 bg-[#0a0a0a] text-white shadow-xl">
        <div className="flex items-center justify-between border-b border-slate-200 px-4 py-4">
          <h2 className="text-lg font-semibold">Notifications</h2>
          <button
            type="button"
            onClick={close}
            className="rounded-md px-1 py-1 text-sm text-slate-500 hover:bg-slate-800 hover:text-slate-300"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-4">
          {isLoading && (
            <div className="text-sm text-slate-500">
              Loading notifications...
            </div>
          )}

          {isError && (
            <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-600">
              Failed to load notifications
            </div>
          )}

          {!isLoading && !isError && (
            <NotificationsList items={data?.data ?? []} />
          )}
        </div>
      </div>
    </div>
  );
};
