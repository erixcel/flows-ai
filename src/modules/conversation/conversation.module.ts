import { Module } from "@nestjs/common";
import { ConversationController } from "./conversation.controller";
import { ConversationService } from "./conversation.service";
import { ClientModule, } from "../client/client.module";

@Module({
  controllers: [ConversationController],
  imports: [ClientModule],
  providers: [ConversationService],
  exports: [ConversationService],
})
export class ConversationModule {
  
}