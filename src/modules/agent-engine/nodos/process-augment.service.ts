import { Injectable } from "@nestjs/common";
import { NodePayload, NodeResponse, stateDefinition } from "../dto/agent";

@Injectable()
export class ProcessAugmentService {

    async process(nodePayload: NodePayload): Promise<typeof stateDefinition.State> {
        const nodeResponse: NodeResponse = new NodeResponse();
        return { payload: nodePayload, result: nodeResponse };
    }
}