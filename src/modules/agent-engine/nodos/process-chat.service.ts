import { Injectable } from "@nestjs/common";
import { Context } from "../model/agent";
import { santos_cachorros } from "../examples/santos-cachorros";

@Injectable()
export class ProcessChatService {

    async process(context: Context): Promise<Context> {
        const chat = santos_cachorros.chat;
        context.payload.chat = chat;
        return { payload: context.payload, result: context.result };
    }
}