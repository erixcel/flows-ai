import { ClientService } from './../../client/client.service';
import { Injectable } from "@nestjs/common";
import { StateGraph, START, END } from "@langchain/langgraph";
import { NodeResponse, contextDefinition, Context, NodePayload } from "../dto/agent";
import { ProcessUserService } from "../nodos/process-user.service";
import { ProcessBotService } from "../nodos/process-bot.service";
import { ProcessChatService } from "../nodos/process-chat.service";
import { ProcessMessagesService } from "../nodos/process-messages.service";
import { ProcessAugmentService } from "./../nodos/process-augment.service";
import { ProcessActionService } from "./../nodos/process-action.service";
import { ProcessResponseService } from "./../nodos/process-response.service";
import { ProcessSendService } from "../nodos/process-send.service";
import { traceable } from "langsmith/traceable";

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
    private clientService: ClientService
  ) {}

  private async processBot(context: Context) {
    const response = await this.processBotService.process(context);
    return response;
  }

  private async processUser(context: Context) {
    const response = await this.processUserService.process(context);
    return response;
  }

  private async processChat(context: Context) {
    const response = await this.processChatService.process(context);
    return response;
  }

  private async processMessages(context: Context) {
    const response = await this.processMessagesService.process(context);
    return response;
  }

  private async processAugment(context: Context) {
    const response = await this.processAugmentService.process(context);
    return response;
  }

  private async processAction(context: Context) {
    const response = await this.processActionService.process(context);
    return response;
  }

  private async processResponse(context: Context) {
    const response = await this.processResponseService.process(context);
    return response;
  }

  private async processSend(context: Context) {
    const response = await this.processSendService.process(context);
    return response;
  }

  async run(nodePayload: NodePayload): Promise<NodeResponse> {

    const workflow = new StateGraph(contextDefinition)
      .addNode("processBot",       this.processBot.bind(this))
      .addNode("processUser",      this.processUser.bind(this))
      .addNode("processChat",      this.processChat.bind(this))
      .addNode("processMessages",  this.processMessages.bind(this))
      .addNode("processAugment",   this.processAugment.bind(this))
      .addNode("processAction",    this.processAction.bind(this))
      .addNode("processResponse",  this.processResponse.bind(this))
      .addNode("processSend",      this.processSend.bind(this));

    type Node = keyof typeof workflow["nodes"];
    type State = Context;


    const conditionalEdge = (successNode: Node, failureNode: Node) => {

      const conditionalFunc = (state: State) => state.result?.status === false ? "failure" : "success";
      const mapping: Record<ReturnType<typeof conditionalFunc>, Node> = {
        success: successNode,
        failure: failureNode,
      };

      return [conditionalFunc, mapping] as const;
    }

    workflow
      .addEdge(START, "processBot")
      .addConditionalEdges("processBot",      ...conditionalEdge("processUser", "processResponse"))
      .addConditionalEdges("processUser",     ...conditionalEdge("processChat", "processResponse"))
      .addConditionalEdges("processChat",     ...conditionalEdge("processMessages", "processResponse"))
      .addConditionalEdges("processMessages", ...conditionalEdge("processAugment", "processResponse"))
      .addConditionalEdges("processAugment",  ...conditionalEdge("processAction", "processResponse"))
      .addEdge("processAction", "processResponse")
      .addEdge("processResponse", "processSend")
      .addEdge("processSend", END);

    const app = workflow.compile();

    // const graph = await app.getGraphAsync();
    // await generateMermaid('src/modules/agent-engine/flow/flow-diagram', graph.drawMermaid());
    const response = await traceable(
      async () => app.invoke({ payload: nodePayload, result: new NodeResponse() }),
      { 
        name: nodePayload.bot.name, 
        project_name: this.clientService.getLangSmithProject(), 
        metadata: { session_id: nodePayload.chat.id } 
      },
    )();

    console.log("Workflow response:", JSON.stringify(response, null, 2));
    return response.result;
  }
}