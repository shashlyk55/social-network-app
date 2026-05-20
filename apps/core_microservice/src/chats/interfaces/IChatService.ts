import { Chat } from 'src/entities/chat.entity';
import {
  CreateChatParams,
  UpdateChatParams,
  FindChatsParams,
  ChatPaginationResult,
} from '../types/chat-service.types';

export interface IChatService {
  create(params: CreateChatParams): Promise<Chat>;
  findAll(params: FindChatsParams): Promise<ChatPaginationResult>;
  findOne(id: number): Promise<Chat>;
  update(params: UpdateChatParams): Promise<Chat>;
  remove(id: number): Promise<void>;

  findUserChats(
    profileId: number,
    params: FindChatsParams,
  ): Promise<ChatPaginationResult>;
}
