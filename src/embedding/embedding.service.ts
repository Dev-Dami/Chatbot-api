import { Injectable, OnModuleInit } from '@nestjs/common';
import nspell from 'nspell';

@Injectable()
export class EmbeddingService implements OnModuleInit {
  private spell: any;

  async onModuleInit() {
    // dictionary-en exports Uint8Array buffers for aff/dic
    const dictionary = (await import('dictionary-en')).default as {
      aff: Uint8Array;
      dic: Uint8Array;
    };

    const aff = Buffer.from(dictionary.aff).toString('utf-8');
    const dic = Buffer.from(dictionary.dic).toString('utf-8');

    this.spell = nspell(aff, dic);
  }

  private correctText(text: string): string {
    if (!this.spell) return text; // fallback if not initialized yet

    return text
      .split(/\s+/)
      .map((word) => {
        if (!this.spell.correct(word)) {
          const suggestions = this.spell.suggest(word);
          return suggestions.length > 0 ? suggestions[0] : word;
        }
        return word;
      })
      .join(' ');
  }

  generateEmbedding(text: string | null | undefined): number[] {
    if (!text) {
      return [];
    }

    const corrected = this.correctText(text);
    const embedding: number[] = [];
    for (const char of Array.from(corrected)) {
      embedding.push(char.codePointAt(0) ?? 0);
    }
    return embedding;
  }
}
