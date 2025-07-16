import { Injectable } from "@nestjs/common";
import { NodePayload, NodeResponse, Context } from "../dto/agent";
import { ConversationService } from "src/modules/conversation/conversation.service";
import { SendText, Template } from "../dto/templates";

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

        console.log("Processing response with data:", data);

        const response = await this.conversationService.handleBasicConversation(data);

        const templateText: SendText = new SendText();
        templateText.template_id = "send_text_evolution";
        templateText.number = context.payload.entry.phone_user;
        templateText.text = response;
        
        context.result.templates.push(templateText);

        return { payload: context.payload, result: context.result };
    }
}