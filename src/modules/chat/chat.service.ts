import { Injectable } from "@nestjs/common";
import { ChatOpenAI, OpenAIEmbeddings } from "@langchain/openai";
import { ConversationChain } from "langchain/chains";
import { CombinedMemory, ConversationTokenBufferMemory, VectorStoreRetrieverMemory } from "langchain/memory";
import { MongoDBAtlasVectorSearch } from "@langchain/mongodb";
import { PromptTemplate } from "@langchain/core/prompts";
import { MongoClient } from "mongodb";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";

@Injectable()
export class ChatService {

  
  private readonly chatOpenAI: ChatOpenAI;
  private readonly chatGeminiAI: ChatGoogleGenerativeAI;

  // Conversation normal
  private readonly userMemories: Map<string, ConversationTokenBufferMemory> = new Map();
  public readonly chainBasic: ConversationChain;

  // Conversation Embeddings 
  private readonly openAIEmbeddings: OpenAIEmbeddings;
  private readonly vectorMemory: CombinedMemory;
  private readonly chainVector: ConversationChain;
  private readonly vectorSearchMongo: MongoDBAtlasVectorSearch;

  constructor() {

    // Conversation normal

    this.chatOpenAI = new ChatOpenAI({
      openAIApiKey: process.env.OPENAI_API_KEY,
      modelName: "gpt-4o-mini",
    });

    this.chatGeminiAI = new ChatGoogleGenerativeAI({
      apiKey: process.env.GOOGLE_API_KEY,
      model: "gemini-2.0-flash-lite",
    })

    // Conversation Embeddings
    this.openAIEmbeddings = new OpenAIEmbeddings({
      openAIApiKey: process.env.OPENAI_API_KEY,
      modelName: "text-embedding-ada-002",
    });

    const client = new MongoClient(process.env.ATLAS_CONNECTION_STRING);
    const index = "index_documents";
    const database = client.db("domus");
    const collection = database.collection("documents");

    this.vectorSearchMongo = new MongoDBAtlasVectorSearch(
      {
        embedDocuments: async (documents: string[]) => {
          return documents.map(() => []);
        },
        embedQuery: async (query) => {
          return this.openAIEmbeddings.embedQuery(query);
        },
      },
      {
        indexName: index,
        collection: collection,
      }
    );

    const prompt = PromptTemplate.fromTemplate(`
      La siguiente es una conversación entre un humano y una IA. La IA tiene acceso a interacciones previas y documentos relevantes.

      Conversación Actual:
      {chat_history}
      
      Información relevante:
      {vector_history}
      
      Pregunta Actual del Usuario:
      {input}
      
      Contexto:
      Eres un agente de IA en la app de WhatsApp

      Ambiente:
      Te encuentras dentro de la aplicación de WhatsApp, donde los usuarios pueden interactuar contigo.
      Osea que ellos te escriben por WhatsApp y tu les estas respondiendo por el mismo medio
      
      Objetivo:
      Tu objetivo es ayudar a los usuarios a encontrar información relevante y responder a sus preguntas de manera efectiva.
      Usa Emojis y un tono amigable, pero mantén la formalidad.
      Que tus respuestas sean breves, concisas y naturales, que parezcas humanas y no de IA.
    `);

    const conversationMemory = new ConversationTokenBufferMemory({
      llm: this.chatOpenAI,
      returnMessages: true,
      memoryKey: "chat_history",
      inputKey: "input",
      outputKey: "response"
    });

    const retrieverMemory = new VectorStoreRetrieverMemory({
      vectorStoreRetriever: this.vectorSearchMongo.asRetriever({ k: 2 }),
      memoryKey: "vector_history",
      returnDocs: true,
      inputKey: "input",
      outputKey: "response"
    });

    this.vectorMemory = new CombinedMemory({
      memories: [conversationMemory, retrieverMemory],
    });

    this.chainVector = new ConversationChain({
      llm: this.chatOpenAI,
      memory: this.vectorMemory,
      prompt: prompt,
      verbose: true
    });
  }

  getUserMemory(sessionId: string): ConversationTokenBufferMemory {
    if (!this.userMemories.has(sessionId)) {
      this.userMemories.set(sessionId, new ConversationTokenBufferMemory({
        llm: this.chatGeminiAI,
      }));
    }
    return this.userMemories.get(sessionId);
  }

  // Conversation normal
  async handleBasicConversation(input: string, sessionId: string): Promise<string> {

    const prompt = PromptTemplate.fromTemplate(`
      La siguiente es una conversación entre un humano y una IA. La IA tiene acceso a interacciones previas y documentos relevantes.

      Pregunta Actual del Usuario:
      {input}
      
      Contexto:
      Eres un agente de IA en la app de WhatsApp

      Ambiente:
      Te encuentras dentro de la aplicación de WhatsApp, donde los usuarios pueden interactuar contigo.
      Osea que ellos te escriben por WhatsApp y tu les estas respondiendo por el mismo medio
      
      Objetivo:
      Tu objetivo es ayudar a los usuarios a encontrar información relevante y responder a sus preguntas de manera efectiva.
      Usa Emojis y un tono amigable, pero mantén la formalidad.
      Que tus respuestas sean breves, concisas y naturales, que parezcas humanas y no de IA.
    `)
    const memory = this.getUserMemory(sessionId);
    const chain = new ConversationChain({
      llm: this.chatGeminiAI,
      memory: memory,
      prompt: prompt
    });
    const result = await chain.call({ input: input });
    return result.response;
  }

  // Conversation Embeddings
  async handleVectorConversation(input: string): Promise<string> {
    const result = await this.chainVector.call({ input });
    return result.response;
  }
}
