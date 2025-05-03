import { Module } from '@nestjs/common';
import { GraphService } from './graph.service';
import { SchemaModule } from '../../schema/schema.module';
import { ConversationModule } from '../../conversation/conversation.module';

@Module({
  imports: [SchemaModule, ConversationModule],
  providers: [GraphService],
  exports: [GraphService],
})
export class GraphModule {}