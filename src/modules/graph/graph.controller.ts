import { Controller, Get, Post, Body } from "@nestjs/common";
import { GraphService } from "./graph.service";

@Controller("graph")
export class GraphController {
  constructor(private readonly graphService: GraphService) {}

  // Endpoint GET ya existente para procesar el workflow clásico.
  @Post("process")
  async processWorkflow(@Body() body: { input: string }) {
    return await this.graphService.processRequest(body.input);
  }
  
  @Post("conversation")
  async processConversation(@Body() body: { input: string, sessionId: string }) {
    return await this.graphService.processConversationWithAppointment(body.input, body.sessionId);
  }
}
