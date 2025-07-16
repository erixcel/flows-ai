import { Injectable } from "@nestjs/common";
import { Context } from "../dto/agent";

@Injectable()
export class ProcessAugmentService {

    async process(context: Context): Promise<Context> {
        return { payload: context.payload, result: context.result };
    }
}