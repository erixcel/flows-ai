import { Injectable } from "@nestjs/common";
import { StateGraph, START, END, Annotation } from "@langchain/langgraph";
import { SchemaService } from "../../schema/schema.service";
import { ConversationService } from "../../conversation/conversation.service";
import { Entry, NodePayload, NodeResponse } from "../dto/entry";
import { Bot, BotProvider, Chat, User } from "../dto/agent";

@Injectable()
export class GraphService {

  private readonly stateDefinition = Annotation.Root({
    payload: Annotation<NodePayload>({
      reducer: (_prev, next) => next,
      default: () => ({
        entry:       undefined as unknown as Entry,
        bot:         undefined as unknown as Bot,
        user:        undefined as unknown as User,
        bot_provider:undefined as unknown as BotProvider,
        chat:        undefined as unknown as Chat,
        messages:    [],
      }),
    }),
    result: Annotation<NodeResponse>({
      reducer: (_prev, next) => next,
      default: () => ({ status: false, templates: [] }),
    }),
  });

  constructor(
    private readonly schemaService: SchemaService,
    private readonly conversationService: ConversationService,
  ) {}

  private async processEntry(state: typeof this.stateDefinition.State) {
    
    return {
      ...state,
      status: true,
    };
  }

  private async processBot(state: typeof this.stateDefinition.State) {
    
    return {
      ...state,
      status: true,
    };
  }

  private async processUser(state: typeof this.stateDefinition.State) {
    
    return {
      ...state,
      status: true,
    };
  }

  private async processChat(state: typeof this.stateDefinition.State) {
    
    return {
      ...state,
      status: true,
    };
  }

  private async processMessages(state: typeof this.stateDefinition.State) {
    
    return {
      ...state,
      status: true,
    };
  }

  async runFlow(entry: Entry) {

    const workflow = new StateGraph(this.stateDefinition)
      .addNode("processEntry", this.processEntry.bind(this))
      .addNode("processBot", this.processBot.bind(this))
      .addNode("processUser", this.processUser.bind(this))
      .addNode("processChat", this.processChat.bind(this))
      .addNode("processMessages", this.processMessages.bind(this))
      
      .addEdge(START, "processEntry")
      .addEdge("processEntry", "processBot")
      .addEdge("processBot", "processUser")
      .addEdge("processUser", "processChat")
      .addEdge("processChat", "processMessages")
      .addEdge("processMessages", END);

    const app = workflow.compile();

    const initialState = {
      processEntry: "",
      processBot: "",
      processUser: "",
      processChat: "",
      processMessages: "",
    };

    // const result = await app.invoke(initialState);
    return {
      response: "Flujo ejecutado correctamente",
    };
  }
}
