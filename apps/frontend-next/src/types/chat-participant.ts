import { ProfilePreview } from "./profile";

export enum ChatParticipantRole {
  MEMBER = "member",
  ADMIN = "admin",
  CREATOR = "creator",
}

export interface ChatParticipant {
  id: number;
  role: ChatParticipantRole;
  joinedAt: Date;
  profile: ProfilePreview;
}
