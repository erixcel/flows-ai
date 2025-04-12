import { Body, Controller, Post } from "@nestjs/common";
import { ChatService } from "./chat.service";

@Controller("chat")
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Post("handle-basic-conversation")
  async handleBasicConversation(@Body() data: {message: string, sessionId: string}) {
    const response = await this.chatService.handleBasicConversation(data.message, data.sessionId);
    return response;
  }

  @Post("handle-vector-conversation")
  async handleVectorConversation(@Body("message") message: string): Promise<string> {
    const response = await this.chatService.handleVectorConversation(message);
    return response;
  }
}