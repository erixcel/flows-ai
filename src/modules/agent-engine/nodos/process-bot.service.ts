import { Injectable } from "@nestjs/common";
import { Context } from "../model/agent";
import { santos_cachorros } from "../examples/santos-cachorros";

@Injectable()
export class ProcessBotService {

    async process(context: Context): Promise<Context> {

        const bot = santos_cachorros.bot;

        return {
            payload: { ...context.payload, bot: bot },
            result:  { ...context.result }
        };
    }
}