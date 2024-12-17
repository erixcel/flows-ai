import { Injectable } from "@nestjs/common";
import { ChatOpenAI, OpenAIEmbeddings } from "@langchain/openai";
import { ConversationChain } from "langchain/chains";
import { CombinedMemory, ConversationTokenBufferMemory, VectorStoreRetrieverMemory } from "langchain/memory";
import { MongoDBAtlasVectorSearch } from "@langchain/mongodb";
import { PromptTemplate } from "@langchain/core/prompts";
import { MongoClient } from "mongodb";

@Injectable()
export class ChatService {

  
  private readonly chatOpenAI: ChatOpenAI;

  // Conversation normal
  private readonly basicMemory: ConversationTokenBufferMemory
  private readonly chainBasic: ConversationChain;

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

    this.basicMemory = new ConversationTokenBufferMemory({
      llm: this.chatOpenAI,
    });

    this.chainBasic = new ConversationChain({
      llm: this.chatOpenAI,
      memory: this.basicMemory,
    });

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
      The following is a conversation between a human and an AI. The AI has access to previous interactions and relevant documents.

      Current conversation:
      {chat_history}
      
      Relevant information:
      {vector_history}
      
      Human: {input}
      AI:`);

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

  // Conversation normal
  async handleBasicConversation(input: string): Promise<string> {
    const result = await this.chainBasic.call({ input });
    return result.response;
  }

  // Conversation Embeddings
  async handleVectorConversation(input: string): Promise<string> {
    const result = await this.chainVector.call({ input });
    return result.response;
  }
}
