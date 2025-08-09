import { Injectable } from "@nestjs/common";
import { NodePayload, NodeResponse, Context } from "../model/agent";

@Injectable()
export class ProcessMessagesService {

    async process(context: Context): Promise<Context> {
        return { payload: context.payload, result: context.result };
    }
}
