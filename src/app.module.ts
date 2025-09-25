import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ChatModule } from './chat/chat.module';
import { EmbeddingModule } from './embedding/embedding.module';

@Module({
  // import chat module
  imports: [ChatModule, EmbeddingModule],
  // app controller
  controllers: [AppController],
  // app service
  providers: [AppService],
})
export class AppModule {}
