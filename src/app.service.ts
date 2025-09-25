import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  // return a welcome message
  getHello(): string {
    return 'Hello World!';
  }
}
