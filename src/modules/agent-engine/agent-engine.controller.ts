import { Controller, Post } from "@nestjs/common";
import { AgentEngineService } from "./agent-engine.service";
import { NodeResponse } from "./dto/agent";

@Controller("agent-engine")
export class AgentEngineController {

    constructor(private agentEngineService: AgentEngineService) {}

    @Post("run-flow")
    async runFlow(): Promise<NodeResponse> {
        return this.agentEngineService.runFlow();
    }
}