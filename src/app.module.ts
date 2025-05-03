import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { EmbeddingModule } from './modules/embeding/embedding.module';
import { FlowModule } from './modules/flow/flow.module';
import { GraphModule } from './modules/agent-engine/graph/graph.module';
import { SchemaModule } from './modules/schema/schema.module';

@Module({
  imports: [
    EmbeddingModule,
    SchemaModule,
    FlowModule,
    GraphModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
