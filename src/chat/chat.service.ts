import { Injectable } from '@nestjs/common';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { EmbeddingService } from '../embedding/embedding.service';
import * as fs from 'fs';
import * as path from 'path';

interface Info {
  name: string;
  personality: string;
  behavior: string;
  knowledge: { topic: string; info: string }[];
}

@Injectable()
export class ChatService {
  private ggenai: GoogleGenerativeAI;
  private info: Info;

  constructor(private readonly embeddingService: EmbeddingService) {
    const geminiApiKey = process.env.GEMINI_API_KEY;
    if (!geminiApiKey) {
      throw new Error('GEMINI_API_KEY is not defined in environment variables.');
    }
    this.ggenai = new GoogleGenerativeAI(geminiApiKey);

    const infoPath = path.join(process.cwd(), 'dist', 'src', 'info.json');
    console.log('Attempting to load info.json from:', infoPath);
    try {
      const infoFile = fs.readFileSync(infoPath, 'utf-8');
      this.info = JSON.parse(infoFile);
      console.log('Successfully loaded and parsed info.json.');
    } catch (error) {
      console.error('Failed to load or parse info.json:', error);
      throw new Error(`Failed to initialize ChatService: Could not load info.json from ${infoPath}. Error: ${error.message}`);
    }
  }

  // generate text embedding
  generateEmbedding(text: string): number[] {
    return this.embeddingService.generateEmbedding(text);
  }

  // handle chat requests
  async chat(userQuery: string): Promise<{ answer: string }> {
    try {
      const model = this.ggenai.getGenerativeModel({ model: 'gemini-2.0-flash' });

      const knowledge = this.info.knowledge.map(k => `- ${k.topic}: ${k.info}`).join('\n');

      const prompt = `
      You are ${this.info.name}, a ${this.info.personality}.
      ${this.info.behavior}

      Here is some information you can use to answer the user's question:
      ${knowledge}

      The user's question is: "${userQuery}"
      `;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      return { answer: text };
    } catch (error) {
      console.error('Error in chat:', error);
      throw new Error('Failed to get response from AI.');
    }
  }
}