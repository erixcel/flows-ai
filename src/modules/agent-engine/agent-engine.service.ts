import { Injectable } from '@nestjs/common';
import { FlowService } from './flow/flow.service';
import { santos_cachorros } from './examples/santos-cachorros';

@Injectable()
export class AgentEngineService {
    
    constructor(
        private flowService: FlowService,
    ) {}
    
    runFlow() {
        return this.flowService.run(santos_cachorros)
    }
}