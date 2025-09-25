import { Module } from '@nestjs/common';
import { ChatController } from './chat.controller';
import { ChatService } from './chat.service';
import { EmbeddingModule } from '../embedding/embedding.module';
import { CreditsModule } from '../credits/credits.module';

@Module({
  imports: [EmbeddingModule, CreditsModule],
  controllers: [ChatController],
  providers: [ChatService],
})
export class ChatModule {}
