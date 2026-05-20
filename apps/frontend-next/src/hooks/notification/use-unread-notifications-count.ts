import { useMemo } from "react";
import { useNotifications } from "@/hooks/notification/use-notifications";

export const useUnreadNotificationsCount = () => {
  const query = useNotifications({
    page: 1,
    limit: 20,
    isRead: false,
  });

  const count = useMemo(() => {
    return query.data?.meta.total ?? 0;
  }, [query.data]);

  return {
    ...query,
    count,
  };
};
