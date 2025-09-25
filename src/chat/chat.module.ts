import { Module } from '@nestjs/common';
import { ChatService } from './chat.service';
import { ChatController } from './chat.controller';
import { EmbeddingModule } from '../embedding/embedding.module';

@Module({
  imports: [EmbeddingModule],
  // chat controller
  controllers: [ChatController],
  // chat service
  providers: [ChatService],
})
export class ChatModule {}
