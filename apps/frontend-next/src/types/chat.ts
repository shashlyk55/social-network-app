import { ChatParticipant } from "./chat-participant";
import { CreateMessageParams } from "./message";

export enum ChatType {
  PRIVATE = "private",
  GROUP = "group",
}

export interface BaseChat {
  id: number;
  type: ChatType;
  name: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface ChatPreview extends BaseChat {
  interlocutor: ChatParticipant | null;
}

export interface ChatDetail extends BaseChat {
  description: string | null;
  interlocutor: ChatParticipant | null;
}

export interface UpdatedChat extends Omit<BaseChat, "createdAt"> {
  description: string | null;
}

export interface CreateChatParams {
  type: ChatType;
  name?: string;
  description?: string;
  participantProfileIds: number[];
  firstMessage?: CreateMessageParams;
}

export interface UpdateChatParams {
  type: ChatType;
  name?: string;
  description?: string | null;
}

export type FindChatParams = {
  type?: ChatType;
  //search?: string;
};
