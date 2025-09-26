import { Injectable } from '@nestjs/common';

@Injectable()
export class CreditsService {
  private userCredits = new Map<number, { credits: number; lastReset: Date }>();

  private readonly MAX_CREDITS = 8;

  getCredits(userId: number): number {
    this.ensureUser(userId);
    const userCredit = this.userCredits.get(userId);
    return userCredit ? userCredit.credits : 0;
  }

  useCredit(userId: number): boolean {
    this.ensureUser(userId);
    const userCredit = this.userCredits.get(userId);
    if (userCredit && userCredit.credits > 0) {
      userCredit.credits -= 1;
      return true;
    }
    return false;
  }

  private ensureUser(userId: number): void {
    if (!this.userCredits.has(userId)) {
      this.userCredits.set(userId, { credits: this.MAX_CREDITS, lastReset: new Date() });
    } else {
      const userCredit = this.userCredits.get(userId);
      if (userCredit) {
        const now = new Date();
        const lastReset = userCredit.lastReset;
        if (
          now.getDate() !== lastReset.getDate() ||
          now.getMonth() !== lastReset.getMonth() ||
          now.getFullYear() !== lastReset.getFullYear()
        ) {
          userCredit.credits = this.MAX_CREDITS;
          userCredit.lastReset = now;
        }
      }
    }
  }
}
