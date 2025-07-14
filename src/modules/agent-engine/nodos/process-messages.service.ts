import { Injectable } from "@nestjs/common";
import { NodePayload, NodeResponse, stateDefinition } from "../dto/agent";

@Injectable()
export class ProcessMessagesService {

    async process(nodePayload: NodePayload): Promise<typeof stateDefinition.State> {
        const nodeResponse: NodeResponse = new NodeResponse();
        nodePayload.messages = [{
            id: "1",
            type: "text",
            text: "Hola que tal",
            chat_id: "1",
            code: "1",
            role: "user",
            media: null,
            quoted: null,
        }]
        return { payload: nodePayload, result: nodeResponse };
    }
}
