import { Injectable } from "@nestjs/common";
import { OpenAIEmbeddings } from "@langchain/openai";
import { ConversationChain } from "langchain/chains";
import { CombinedMemory, ConversationTokenBufferMemory, VectorStoreRetrieverMemory } from "langchain/memory";
import { MongoDBAtlasVectorSearch } from "@langchain/mongodb";
import { PromptTemplate } from "@langchain/core/prompts";
import { LlmModel } from "../client/dto/client.dto";
import { ClientService } from "../client/client.service";
import { traceable } from "langsmith/traceable";
import { createReactAgent } from "@langchain/langgraph/prebuilt";
import { BaseMessage } from "@langchain/core/messages";

@Injectable()
export class ConversationService {

  // Memories
  private readonly normalMemories: Map<string, ConversationTokenBufferMemory> = new Map();
  private readonly vectorMemories: Map<string, CombinedMemory> = new Map();

  // Conversation Embeddings 
  private readonly openAIEmbeddings: OpenAIEmbeddings;
  private readonly vectorSearchMongo: MongoDBAtlasVectorSearch;

  constructor(
    private readonly clientService: ClientService,
  ) {

    const index = "index_documents";
    const database = this.clientService.getMongo().db("domus");
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
  }

  getPromptTemplate(prompt_base: string): PromptTemplate {
    return PromptTemplate.fromTemplate(prompt_base + `
      La siguiente es una conversación entre un humano y una IA. La IA tiene acceso a interacciones previas y documentos relevantes.

      Conversación Actual:
      {chat_history}

      Formato de la respuesta:
      Responde de manera concisa y clara, sin rodeos, que sea fácil de entender para el usuario y que no parezca robotizado.

      Pregunta Actual del Usuario:
      {input}`
    );
  }

  getPromptTemplateVector(prompt_base: string): PromptTemplate {
    return PromptTemplate.fromTemplate(`
      La siguiente es una conversación entre un humano y una IA. La IA tiene acceso a interacciones previas y documentos relevantes.

      Conversación Actual:
      {chat_history}
      
      Información relevante:
      {vector_history}
      
      Pregunta Actual del Usuario:
      {input}` + prompt_base
    );
  }

  getNormalMemory(session_id: string, model: LlmModel): ConversationTokenBufferMemory {
    if (!this.normalMemories.has(session_id)) {
      this.normalMemories.set(session_id, new ConversationTokenBufferMemory({
        llm: this.clientService.getLlm(model),
        memoryKey: "chat_history",
        inputKey: "input",
        outputKey: "response",
        maxTokenLimit: 1000  // Añadir límite apropiado
      }));
    }
    return this.normalMemories.get(session_id);
  }

  getVectorMemory(session_id: string, model: LlmModel): CombinedMemory {
    if (!this.vectorMemories.has(session_id)) {
      const conversationMemory = new ConversationTokenBufferMemory({
        llm: this.clientService.getLlm(model),
        returnMessages: true,
        memoryKey: "chat_history",
        inputKey: "input",
        outputKey: "response"
      });

      const retrieverMemory = new VectorStoreRetrieverMemory({
        vectorStoreRetriever: this.vectorSearchMongo.asRetriever({ k: 2 }),
        returnDocs: true,
        memoryKey: "vector_history",
        inputKey: "input",
        outputKey: "response"
      });

      this.vectorMemories.set(session_id, new CombinedMemory({
        memories: [conversationMemory, retrieverMemory],
      }));
    }
    return this.vectorMemories.get(session_id);
  }

  async handleAvancedConversation( data: {
    session_id: string,
    model: LlmModel,
    agent_name: string,
    base_messages: BaseMessage[]
  }): Promise<string> {

    const llm = this.clientService.getLlm(data.model);
    const agent = createReactAgent({ llm: llm, tools: []});

    const result = await traceable(
      async () => agent.invoke({messages: data.base_messages}),
      { 
        name: data.agent_name, 
        project_name: this.clientService.getLangSmithProject(), 
        metadata: { session_id: data.session_id } },
    )();

    const lastIndex = result.messages.length - 1;

    return result.messages[lastIndex].text;
  }

  // Conversation normal
  async handleBasicConversation( data: {
    input: string, 
    prompt_base: string, 
    session_id: string,
    model: LlmModel,
    agent_name: string,
  }): Promise<string> {

    const prompt = this.getPromptTemplate(data.prompt_base);
    const memory = this.getNormalMemory(data.session_id, data.model);
    const llm = this.clientService.getLlm(data.model);

    const chain = new ConversationChain({
      llm: llm,
      memory: memory,
      prompt: prompt,
    });

    const result = await traceable(
      async () => chain.invoke({ input: data.input }),
      { 
        name: data.agent_name, 
        project_name: this.clientService.getLangSmithProject(), 
        metadata: { session_id: data.session_id } },
    )();

    return result.response;
  }

  // Conversation Embeddings
  async handleVectorConversation( data: {
    input: string,
    prompt_base: string, 
    session_id: string,
    model: LlmModel,
    agent_name: string,
  }): Promise<string> {
    const prompt = this.getPromptTemplateVector(data.prompt_base);
    const memory = this.getVectorMemory(data.session_id, data.model);
    const llm = this.clientService.getLlm(data.model);

    const chain = new ConversationChain({
      llm: llm,
      memory: memory,
      prompt: prompt,
    })

    const result = await traceable(
      async () => chain.invoke({ input: data.input }),
      { 
        name: data.agent_name, 
        project_name: this.clientService.getLangSmithProject(), 
        metadata: { session_id: data.session_id } },
    )();

    return result.response;
  }
}
