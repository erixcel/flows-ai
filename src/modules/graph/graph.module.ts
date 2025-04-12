import { Module } from "@nestjs/common";
import { GraphService } from "./graph.service";
import { GraphController } from "./graph.controller";
import { ChatService } from "../chat/chat.service";

@Module({
    controllers: [GraphController],
    providers: [GraphService, ChatService],
    exports: [GraphService],
})
export class GraphModule {

}