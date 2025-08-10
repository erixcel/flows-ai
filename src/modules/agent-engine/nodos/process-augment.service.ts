import { Injectable } from "@nestjs/common";
import { Context } from "../model/agent";

@Injectable()
export class ProcessAugmentService {

    async process(context: Context): Promise<Context> {
        return {
            payload: { ...context.payload },
            result:  { ...context.result }
        };
    }
}