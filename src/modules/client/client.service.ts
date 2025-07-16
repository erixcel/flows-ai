import { Injectable } from '@nestjs/common';
import { OpenAIEmbeddings } from "@langchain/openai";
import { Pinecone } from "@pinecone-database/pinecone";
import { MongoClient } from "mongodb";
import { ChatOpenAI } from "@langchain/openai";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { LlmModel } from './dto/client.dto';

@Injectable()
export class ClientService {

  private readonly embedding: OpenAIEmbeddings;
  private readonly pinecone: Pinecone;
  private readonly mongo: MongoClient;
  private readonly chatOpenAI: ChatOpenAI;
  private readonly chatGeminiAI: ChatGoogleGenerativeAI;
  private readonly openAIEmbeddings: OpenAIEmbeddings;
  private readonly langSmithProject: string;

  constructor() {
    // Initialize embedding
    this.embedding = new OpenAIEmbeddings({
      openAIApiKey: process.env.OPENAI_API_KEY,
    });

    // Initialize Pinecone
    this.pinecone = new Pinecone({
      apiKey: process.env.PICONE_API_KEY,
    });
    
    // Initialize MongoDB
    this.mongo = new MongoClient(
      process.env.ATLAS_CONNECTION_STRING
    );

    // Initialize ChatOpenAI
    this.chatOpenAI = new ChatOpenAI({
      openAIApiKey: process.env.OPENAI_API_KEY,
      modelName: "gpt-4o-mini",
    });

    // Initialize ChatGeminiAI
    this.chatGeminiAI = new ChatGoogleGenerativeAI({
      apiKey: process.env.GOOGLE_API_KEY,
      model: "gemini-2.5-flash-lite-preview-06-17",
    });

    // Initialize OpenAIEmbeddings for conversations
    this.openAIEmbeddings = new OpenAIEmbeddings({
      openAIApiKey: process.env.OPENAI_API_KEY,
      modelName: "text-embedding-ada-002",
    });

    // Initialize LangSmith project
    this.langSmithProject = process.env.LANGCHAIN_PROJECT || "erixcel-new";
  }

  // Getters for each client
  getEmbedding(): OpenAIEmbeddings {
    return this.embedding;
  }

  getPinecone(): Pinecone {
    return this.pinecone;
  }

  getMongo(): MongoClient {
    return this.mongo;
  }

  getChatOpenAI(): ChatOpenAI {
    return this.chatOpenAI;
  }

  getChatGeminiAI(): ChatGoogleGenerativeAI {
    return this.chatGeminiAI;
  }

  getOpenAIEmbeddings(): OpenAIEmbeddings {
    return this.openAIEmbeddings;
  }

  getLangSmithProject(): string {
    return this.langSmithProject;
  }

  getLlm(model: LlmModel): ChatOpenAI | ChatGoogleGenerativeAI {
    switch (model) {
      case "gpt":
        return this.getChatOpenAI();
      case "gemini":
        return this.getChatGeminiAI();
      default:
        return this.getChatOpenAI();
    }
  }
}