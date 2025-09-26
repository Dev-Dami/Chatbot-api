import { Injectable } from '@nestjs/common';
import { User } from './user.interface';

@Injectable()
export class UserService {
  private readonly users: User[] = [
    {
      id: 1,
      username: 'test',
      password_hash: 'test',
    },
        {
      id: 2,
      username: 'dami',
      password_hash: 'dami',
    },
  ];

  async findOne(username: string): Promise<User | undefined> {
    return this.users.find(user => user.username === username);
  }
}
