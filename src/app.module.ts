import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { EmbeddingModule } from './modules/embeding/embedding.module';
import { SchemaModule } from './modules/schema/schema.module';
import { AgentEngineModule } from './modules/agent-engine/agent-engine.module';
import { ConversationModule } from './modules/conversation/conversation.module';

@Module({
  imports: [
    ConversationModule,
    EmbeddingModule,
    SchemaModule,
    AgentEngineModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
