import { Controller, UploadedFile, UseInterceptors } from "@nestjs/common";
import { EmbeddingService } from "./embedding.service";
import { Body, Post } from '@nestjs/common';
import { FileInterceptor } from "@nestjs/platform-express";

@Controller("embedding")
export class EmbeddingController {
  constructor(private embeddingService: EmbeddingService) {}
  
  @Post('register-embeddings-atlas')
  async registerEmbeddingsAtlas(
    @Body('data') data: string[],
    @Body('database') database: string,
    @Body('collection') collection: string,
    @Body('extra') extra: Record<string, any>,
  ): Promise<void> {
    await this.embeddingService.registerEmbeddingsAtlas(data, database, collection, extra);
  }

  @Post('create-atlas-vector-index')
  async createAtlasVectorIndex(
    @Body('database') database: string,
    @Body('collection') collection: string,
    @Body('index') index: string,
    @Body('field') field: string,
    @Body('filters') filters: string[],
  ): Promise<void> {
    await this.embeddingService.createAtlasVectorIndex(database, collection, index, field, filters);
  }

  @Post('vector-query-atlas')
  async vectorQueryAtlas(
    @Body('query') query: string,
    @Body('database') database: string,
    @Body('collection') collection: string,
    @Body('index') index: string,
    @Body('buildings') buildings: string[],
  ): Promise<any> {
    return await this.embeddingService.vectorQueryAtlas(query, database, collection, index, buildings);
  }

  @Post('split-text-paragraphs')
  @UseInterceptors(FileInterceptor('file'))
  async splitTextParagraphs(@UploadedFile() file: Express.Multer.File): Promise<string[]> {
    if (!file) throw new Error('No se adjuntó ningún archivo');
    return await this.embeddingService.splitTextParagraphs(file.buffer.toString());
  }
}