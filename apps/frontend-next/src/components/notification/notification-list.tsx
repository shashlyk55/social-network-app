"use client";

import { NotificationItem } from "@/components/notification/notification-item";
import { UserNotification } from "@/types/notification";

interface NotificationsListProps {
  items: UserNotification[];
}

export const NotificationsList = ({ items }: NotificationsListProps) => {
  if (items.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-slate-200 bg-white p-6 text-center text-sm text-slate-500">
        No notifications yet
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {items.map((item) => (
        <NotificationItem
          key={`${item.notification.id}-${item.readAt ?? "unread"}`}
          item={item}
        />
      ))}
    </div>
  );
};
