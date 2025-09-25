import { Injectable } from '@nestjs/common';

@Injectable()
export class EmbeddingService {
  generateEmbedding(text: string | null | undefined): number[] {
    if (!text) {
      return [];
    }

    const embedding: number[] = [];
    for (const char of Array.from(text)) {
      embedding.push(char.codePointAt(0) ?? 0);
    }
    return embedding;
  }
}
