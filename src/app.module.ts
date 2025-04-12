import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { EmbeddingModule } from './modules/embeding/embedding.module';
import { ChatModule } from './modules/chat/chat.module';
import { FlowModule } from './modules/flow/flow.module';
import { GraphModule } from './modules/graph/graph.module';

@Module({
  imports: [
    EmbeddingModule,
    ChatModule,
    FlowModule,
    GraphModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
