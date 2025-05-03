import { Module } from "@nestjs/common";
import { ConversationController } from "./conversation.controller";
import { ConversationService } from "./conversation.service";
import { ClientService } from "../client/client.service";

@Module({
  controllers: [ConversationController],
  providers: [ConversationService, ClientService],
  exports: [ConversationService],
})
export class ConversationModule {
  
}