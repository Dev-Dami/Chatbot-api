import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ChatModule } from './chat/chat.module';
import { EmbeddingModule } from './embedding/embedding.module';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { CreditsModule } from './credits/credits.module';

@Module({
  // import chat module
  imports: [ChatModule, EmbeddingModule, AuthModule, UserModule, CreditsModule],
  // app controller
  controllers: [AppController],
  // app service
  providers: [AppService],
})
export class AppModule {}
