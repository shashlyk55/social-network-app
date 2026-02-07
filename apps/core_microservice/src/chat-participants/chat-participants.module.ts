import { Module } from '@nestjs/common';
import { ChatParticipantsService } from './chat-participants.service';
import { ChatsModule } from 'src/chats/chats.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChatParticipant } from 'src/entities/many-to-many/chat-participants.entity';
import { ChatParticipantsController } from './chat-participants.controller';
import { ProfilesModule } from 'src/profiles/profiles.module';
import { Chat } from 'src/entities/chat.entity';

@Module({
  controllers: [ChatParticipantsController],
  providers: [ChatParticipantsService],
  imports: [
    ChatsModule,
    TypeOrmModule.forFeature([ChatParticipant, Chat]),
    ProfilesModule,
  ],
})
export class ChatParticipantsModule {}
