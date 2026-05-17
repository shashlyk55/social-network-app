export enum NotificationType {
  POST_LIKE = 'POST_LIKE',
  NEW_COMMENT = 'NEW_COMMENT',
  COMMENT_REPLY = 'COMMENT_REPLY',
  COMMENT_LIKE = 'COMMENT_LIKE',
  FOLLOW_REQUEST = 'FOLLOW_REQUEST',
  ACCEPT_FOLLOW_REQUEST = 'ACCEPT_FOLLOW_REQUEST',
  DECLINE_FOLLOW_REQUEST = 'DECLINE_FOLLOW_REQUEST',
  SYSTEM = 'SYSTEM',
}

export const NotificationTitleTemplates: Record<NotificationType, string> = {
  [NotificationType.POST_LIKE]: 'User liked your post',
  [NotificationType.NEW_COMMENT]: 'User commented on your post',
  [NotificationType.COMMENT_REPLY]: 'User replied to your comment',
  [NotificationType.COMMENT_LIKE]: 'User liked your comment',
  [NotificationType.FOLLOW_REQUEST]: 'User requested to follow you',
  [NotificationType.ACCEPT_FOLLOW_REQUEST]: 'User accepted your follow request',
  [NotificationType.DECLINE_FOLLOW_REQUEST]:
    'User declined your follow request',
  [NotificationType.SYSTEM]: 'System notification',
};
