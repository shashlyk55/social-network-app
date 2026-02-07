import { Module } from '@nestjs/common';
import { ChatsService } from './chats.service';
import { ChatsController } from './chats.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Chat } from 'src/entities/chat.entity';
import { ChatParticipant } from 'src/entities/many-to-many/chat-participants.entity';
import { ProfilesModule } from 'src/profiles/profiles.module';
import { Message } from 'src/entities/message.entity';

@Module({
  controllers: [ChatsController],
  providers: [ChatsService],
  imports: [
    TypeOrmModule.forFeature([Chat, ChatParticipant, Message]),
    ProfilesModule,
  ],
  exports: [ChatsService],
})
export class ChatsModule {}
