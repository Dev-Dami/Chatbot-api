import { Controller, Post, Body } from '@nestjs/common';
import { ChatService } from './chat.service';

@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Post()
  async chat(
    @Body('query') query: string,
    @Body('userId') userId: number,
    @Body('history') history: { type: string; text: string }[],
  ) {
    return this.chatService.chat(query, userId, history);
  }
}
