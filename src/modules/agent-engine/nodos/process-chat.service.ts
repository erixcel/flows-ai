import { Injectable } from "@nestjs/common";
import { NodePayload, NodeResponse, Context } from "../dto/agent";

@Injectable()
export class ProcessChatService {

    async process(context: Context): Promise<Context> {
        return { payload: context.payload, result: context.result };
    }
}