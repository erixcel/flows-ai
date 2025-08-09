import { Injectable } from '@nestjs/common';
import { FlowService } from './flow/flow.service';
import { NodePayload } from './model/agent';
import { EntryMeta } from './model/meta';
import { AdapterService } from './adapter/adapter.service';

@Injectable()
export class AgentEngineService {
    
    constructor(
        private flowService: FlowService,
        private adapterService: AdapterService
    ) {}

    runFlowProduction(entryMeta: EntryMeta) {
        const entry = this.adapterService.adaptEntryMeta(entryMeta);
        const nodePayload: NodePayload = { entry: entry };
        return this.flowService.run(nodePayload);
    }

    runFlowDevelopment(nodePayload: NodePayload) {
        return this.flowService.run(nodePayload);
    }
}