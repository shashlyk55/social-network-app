import { ProfilePreview } from "./profile";

export interface CreateMessageParams {
  content: string;
  replyToMessageId?: number;
}

export interface Message {
  id: number;
  content: string;
  profile: ProfilePreview;
  chatId: number;
  isEdited: boolean;
  createdAt: Date;
  replyMessage: number | null;
}
