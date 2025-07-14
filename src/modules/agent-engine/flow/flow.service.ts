import { Injectable } from "@nestjs/common";
import { StateGraph, START, END } from "@langchain/langgraph";
import { NodePayload, NodeResponse, stateDefinition } from "../dto/agent";
import { ProcessUserService } from "../nodos/process-user.service";
import { ProcessBotService } from "../nodos/process-bot.service";
import { ProcessChatService } from "../nodos/process-chat.service";
import { ProcessMessagesService } from "../nodos/process-messages.service";
import { ProcessAugmentService } from "./../nodos/process-augment.service";
import { ProcessActionService } from "./../nodos/process-action.service";
import { ProcessResponseService } from "./../nodos/process-response.service";
import { ProcessSendService } from "../nodos/process-send.service";

@Injectable()
export class FlowService {

  constructor(
    private processUserService: ProcessUserService,
    private processBotService: ProcessBotService,
    private processChatService: ProcessChatService,
    private processMessagesService: ProcessMessagesService,
    private processActionService: ProcessActionService,
    private processAugmentService: ProcessAugmentService,
    private processResponseService: ProcessResponseService,
    private processSendService: ProcessSendService,
  ) {}

  private async processBot(state: typeof stateDefinition.State) {
    const response = await this.processBotService.process(state.payload);
    return response;
  }

  private async processUser(state: typeof stateDefinition.State) {
    const response = await this.processUserService.process(state.payload);
    return response;
  }

  private async processChat(state: typeof stateDefinition.State) {
    const response = await this.processChatService.process(state.payload);
    return response;
  }

  private async processMessages(state: typeof stateDefinition.State) {
    const response = await this.processMessagesService.process(state.payload);
    return response;
  }

  private async processAugment(state: typeof stateDefinition.State) {
    const response = await this.processAugmentService.process(state.payload);
    return response;
  }

  private async processAction(state: typeof stateDefinition.State) {
    const response = await this.processActionService.process(state.payload);
    return response;
  }

  private async processResponse(state: typeof stateDefinition.State) {
    const response = await this.processResponseService.process(state.payload);
    return response;
  }

  private async processSend(state: typeof stateDefinition.State) {
    const response = await this.processSendService.process(state.payload);
    return response;
  }

  async run(nodePayload: NodePayload): Promise<NodeResponse> {

    const workflow = new StateGraph(stateDefinition)
      .addNode("processBot", this.processBot.bind(this))
      .addNode("processUser", this.processUser.bind(this))
      .addNode("processChat", this.processChat.bind(this))
      .addNode("processMessages", this.processMessages.bind(this))
      .addNode("processAugment", this.processAugment.bind(this))
      .addNode("processAction", this.processAction.bind(this))
      .addNode("processResponse", this.processResponse.bind(this))
      .addNode("processSend", this.processSend.bind(this))
      
      .addEdge(START, "processBot")
      .addEdge("processBot", "processUser")
      .addEdge("processUser", "processChat")
      .addEdge("processChat", "processMessages")
      .addEdge("processMessages", "processAugment")
      .addEdge("processAugment", "processAction")
      .addEdge("processAction", "processResponse")
      .addEdge("processResponse", "processSend")
      .addEdge("processSend", END)
      
      .addConditionalEdges("processBot", (state) => {
        if (state.result.status === true) 
          return "processResponse"
      })

    const app = workflow.compile();
    const response = await app.invoke({payload: nodePayload});
    console.log("Workflow response:", JSON.stringify(response, null, 2));

    return response.result;
  }
}
