import { Module } from '@nestjs/common';
import { SchemaService } from './schema.service';
import { ClientService } from '../client/client.service';

@Module({
  controllers: [],
  providers: [SchemaService, ClientService],
  exports: [SchemaService],
})
export class SchemaModule {}