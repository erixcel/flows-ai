import { Body, Controller, Post } from "@nestjs/common";
import { ConversationService } from "./conversation.service";
import { LlmModel } from "../client/dto/client.dto";
import { BaseMessage } from "@langchain/core/messages";


@Controller("conversation")
export class ConversationController {
  constructor(private readonly conversationService: ConversationService) {}

  @Post("handle-basic-conversation")
  async handleBasicConversation(@Body() data: {
    input: string, 
    prompt_base: string,
    session_id: string,
    model: LlmModel,
    agent_name: string,
  }) {
    const response = await this.conversationService.handleBasicConversation(data);
    return response;
  }

  @Post("handle-vector-conversation")
  async handleVectorConversation(@Body() data: {
    input: string, 
    prompt_base: string,
    session_id: string,
    model: LlmModel,
    agent_name: string,
  }) {
    const response = await this.conversationService.handleVectorConversation(data);
    return response;
  }

  @Post("handle-advanced-conversation")
  async handleAdvancedConversation(@Body() data: {
    session_id: string,
    model: LlmModel,
    agent_name: string,
    base_messages: BaseMessage[]
  }) {
    const response = await this.conversationService.handleAvancedConversation(data);
    return response;
  }

}