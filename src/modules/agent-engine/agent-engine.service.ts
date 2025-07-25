import { Injectable } from '@nestjs/common';
import { FlowService } from './flow/flow.service';
import { santos_cachorros } from './examples/santos-cachorros';
import { NodePayload } from './dto/agent';

@Injectable()
export class AgentEngineService {
    
    constructor(
        private flowService: FlowService,
    ) {}

    runFlowDevelopment(nodePayload: NodePayload) {
        return this.flowService.run(nodePayload);
    }
}