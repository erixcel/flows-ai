import { Injectable } from "@nestjs/common";
import { Context } from "../model/agent";
import { santos_cachorros } from "../examples/santos-cachorros";

@Injectable()
export class ProcessUserService {

    async process(context: Context): Promise<Context> {

        const user = santos_cachorros.user;

        return {
            payload: { ...context.payload, user: user },
            result:  { ...context.result }
        };
    }
}