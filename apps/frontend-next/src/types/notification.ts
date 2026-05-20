export enum NotificationType {
  POST_LIKE = "POST_LIKE",
  NEW_COMMENT = "NEW_COMMENT",
  COMMENT_REPLY = "COMMENT_REPLY",
  COMMENT_LIKE = "COMMENT_LIKE",
  FOLLOW_REQUEST = "FOLLOW_REQUEST",
  ACCEPT_FOLLOW_REQUEST = "ACCEPT_FOLLOW_REQUEST",
  DECLINE_FOLLOW_REQUEST = "DECLINE_FOLLOW_REQUEST",
  SYSTEM = "SYSTEM",
}

export const notificationTypeLabelMap: Record<NotificationType, string> = {
  [NotificationType.POST_LIKE]: "Post like",
  [NotificationType.NEW_COMMENT]: "New comment",
  [NotificationType.COMMENT_REPLY]: "Comment reply",
  [NotificationType.COMMENT_LIKE]: "Comment like",
  [NotificationType.FOLLOW_REQUEST]: "Follow request",
  [NotificationType.ACCEPT_FOLLOW_REQUEST]: "Follow accepted",
  [NotificationType.DECLINE_FOLLOW_REQUEST]: "Follow declined",
  [NotificationType.SYSTEM]: "System",
};

export interface NotificationInfo {
  id: number;
  type: NotificationType;
  title: string;
  message: string;
  data: Record<string, unknown> | null;
  createdAt: string;
}

export interface UserNotification {
  isRead: boolean;
  readAt: string | null;
  notification: NotificationInfo;
}

export interface NotificationsMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface NotificationsResponse {
  data: UserNotification[];
  meta: NotificationsMeta;
}

export interface FindNotificationsParams {
  page?: number;
  limit?: number;
  isRead?: boolean;
  type?: NotificationType;
}
