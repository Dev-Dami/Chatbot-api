import { Injectable } from '@nestjs/common';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { Pinecone } from '@pinecone-database/pinecone';

@Injectable()
export class ChatService {
  private ggenai: GoogleGenerativeAI;
  private pinecone: Pinecone;

  constructor() {
    const geminiApiKey = process.env.GEMINI_API_KEY;
    const pineconeApiKey = process.env.PINECONE_API_KEY;

    if (!geminiApiKey) {
      throw new Error(
        'GEMINI_API_KEY is not defined in environment variables.',
      );
    }
    if (!pineconeApiKey) {
      throw new Error(
        'PINECONE_API_KEY is not defined in environment variables.',
      );
    }

    this.ggenai = new GoogleGenerativeAI(geminiApiKey);
    this.pinecone = new Pinecone({ apiKey: pineconeApiKey });
  }

  async generateEmbedding(text: string) {
    try {
      const model = this.ggenai.getGenerativeModel({ model: 'embedding-001' });
      const result = await model.embedContent(text);
      return result.embedding.values;
    } catch (error: any) {
      if (error.status === 429) {
        console.error(
          'Error generating embedding: Gemini API quota exceeded.',
          error,
        );
        throw new Error(
          'Gemini API quota exceeded. Please check your Google Cloud project settings.',
        );
      } else {
        console.error('Error generating embedding:', error);
        throw new Error('Failed to generate embedding.');
      }
    }
  }

  async ragChat(userQuery: string) {
    try {
      // Step 1: Embed query
      const embedding = await this.generateEmbedding(userQuery);

      // Step 2: Retrieve docs
      const pineconeIndexName = process.env.PINECONE_INDEX_NAME;
      if (!pineconeIndexName) {
        throw new Error(
          'PINECONE_INDEX_NAME is not defined in environment variables.',
        );
      }
      const index = this.pinecone.Index(pineconeIndexName);
      const queryResponse = await index.query({
        topK: 3,
        vector: embedding,
        includeMetadata: true,
      });

      const contextDocs = queryResponse.matches
        .map((m) => (m.metadata ? m.metadata.text : ''))
        .join('\n');

      // Step 3: Send context + query to Gemini
      const model = this.ggenai.getGenerativeModel({
        model: 'gemini-2.0-flash',
      });

      const prompt = `
      You are a helpful AI assistant. 
      Use the following context to answer the user’s question.
      Context:
      ${contextDocs}
      
      Question: ${userQuery}
      `;

      const result = await model.generateContent(prompt);
      return result.response.text();
    } catch (error) {
      console.error('Error in ragChat:', error);
      throw new Error('Failed to get response from AI.');
    }
  }
}
