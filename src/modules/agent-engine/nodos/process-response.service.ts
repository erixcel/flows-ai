import { Injectable } from "@nestjs/common";
import { NodePayload, NodeResponse, Context } from "../model/agent";
import { ConversationService } from "src/modules/conversation/conversation.service";
import { SendText, Template } from "../model/templates";

@Injectable()
export class ProcessResponseService {

    constructor(
        private conversationService: ConversationService,
    ) {}

    async process(context: Context): Promise<Context> {

        const data = {
            agent_name: context.payload.bot.name,
            model: context.payload.bot.model,
            prompt_base: context.payload.bot.prompt,
            session_id: context.payload.chat.id,
            input: context.payload.entry.text,
        }

        const response = await this.conversationService.handleBasicConversation(data);

        const templateText: SendText = new SendText();
        templateText.to = context.payload.entry.phone_user;
        templateText.text.body = response;

        const templates: Template[] = [templateText];

        return {
            payload: { ...context.payload },
            result:  { ...context.result, templates: templates }
        };
    }
}