import { Chat } from 'src/entities/chat.entity';
import {
  CreateChatParams,
  FindAllChatsParams,
  FindAllChatsResult,
  UpdateChatParams,
  UserChatParams,
  ChatIdParams,
  UserIdParams,
} from '../types/chat-service.types';

export interface IChatsService {
  create(params: CreateChatParams): Promise<Chat>;
  findAll(params: FindAllChatsParams): Promise<FindAllChatsResult>;
  findOne(params: UserChatParams): Promise<Chat>;
  update(params: UserChatParams & UpdateChatParams): Promise<Chat>;
  remove(params: UserChatParams): Promise<void>;
}
