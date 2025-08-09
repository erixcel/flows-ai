import { Body, Controller, Post } from "@nestjs/common";
import { ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AgentEngineService } from "./agent-engine.service";
import { NodePayload, NodeResponse } from "./model/agent";
import { EntryMeta } from "./model/meta";
import { flow_development } from "./dto/agent-engine.dto";

@ApiTags('agent-engine')
@Controller("agent-engine")
export class AgentEngineController {

    constructor(private agentEngineService: AgentEngineService) {}

    @Post("flow-production")
    @ApiOperation({ summary: 'Run the production flow' })
    // @ApiBody({ schema: { example: santos_cachorros } })
    async runFlowProduction(@Body() entryMeta: EntryMeta): Promise<NodeResponse> {
        console.log("Received entryMeta:", JSON.stringify(entryMeta, null, 2));
        return this.agentEngineService.runFlowProduction(entryMeta);
    }

    @Post("flow-development")
    @ApiOperation({ summary: 'Test the flow manually' })
    @ApiBody({ schema: { example: flow_development } })
    async runFlowDevelopment(@Body() nodePayload: NodePayload): Promise<NodeResponse> {
        return this.agentEngineService.runFlowDevelopment(nodePayload);
    }
}