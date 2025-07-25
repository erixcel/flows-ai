import { Body, Controller, Post } from "@nestjs/common";
import { AgentEngineService } from "./agent-engine.service";
import { Entry, NodePayload, NodeResponse } from "./dto/agent";

@Controller("agent-engine")
export class AgentEngineController {

    constructor(private agentEngineService: AgentEngineService) {}

    @Post("flow-development")
    async runFlowDevelopment(@Body() nodePayload: NodePayload): Promise<NodeResponse> {
        return this.agentEngineService.runFlowDevelopment(nodePayload);
    }
}