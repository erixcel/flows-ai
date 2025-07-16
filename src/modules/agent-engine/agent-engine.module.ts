import { Module } from "@nestjs/common";
import { AgentEngineService } from "./agent-engine.service";
import { AgentEngineController } from "./agent-engine.controller";
import { ProcessBotService } from "./nodos/process-bot.service";
import { ProcessUserService } from "./nodos/process-user.service";
import { ProcessChatService } from "./nodos/process-chat.service";
import { ProcessMessagesService } from "./nodos/process-messages.service";
import { ProcessActionService } from "./nodos/process-action.service";
import { ProcessAugmentService } from "./nodos/process-augment.service";
import { ProcessResponseService } from "./nodos/process-response.service";
import { ProcessSendService } from "./nodos/process-send.service";
import { FlowService } from "./flow/flow.service";
import { ConversationModule } from "../conversation/conversation.module";
import { ClientModule } from "../client/client.module";

@Module({
    controllers: [AgentEngineController],
    providers: [
        AgentEngineService,
        ProcessBotService,
        ProcessUserService,
        ProcessChatService,
        ProcessMessagesService,
        ProcessActionService,
        ProcessAugmentService,
        ProcessResponseService,
        ProcessSendService,
        FlowService,
    ],
    imports: [
        ConversationModule,
        ClientModule,
    ],
    exports: [AgentEngineService],
})
export class AgentEngineModule {

}