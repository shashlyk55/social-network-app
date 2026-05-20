"use client";

import { formatDistanceToNow } from "date-fns";
import {
  notificationTypeLabelMap,
  UserNotification,
} from "@/types/notification";
import { cn } from "@/lib/utils/cn";

interface NotificationItemProps {
  item: UserNotification;
}

export const NotificationItem = ({ item }: NotificationItemProps) => {
  const notification = item.notification;

  return (
    <div
      className={cn(
        "rounded-xl border p-4 transition-colors",
        item.isRead ? "border-slate-200 bg-white" : "border-sky-200 bg-sky-50"
      )}
    >
      <div className="mb-2 flex items-center justify-between gap-3">
        <span className="text-xs font-medium uppercase tracking-wide text-slate-500">
          {notificationTypeLabelMap[notification.type]}
        </span>

        <span className="text-xs text-slate-400">
          {formatDistanceToNow(new Date(notification.createdAt), {
            addSuffix: true,
          })}
        </span>
      </div>

      <div className="space-y-1">
        <p className="text-sm font-semibold text-slate-900">
          {notification.title}
        </p>
        <p className="text-sm text-slate-600">{notification.message}</p>
      </div>
    </div>
  );
};
