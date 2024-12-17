import { Controller, UploadedFile, UseInterceptors } from "@nestjs/common";
import { EmbeddingService } from "./embedding.service";
import { Body, Post } from '@nestjs/common';
import { FileInterceptor } from "@nestjs/platform-express";

@Controller("embedding")
export class EmbeddingController {
  constructor(private readonly embeddingService: EmbeddingService) {}

  @Post('upload-domus-document')
  @UseInterceptors(FileInterceptor('file'))
  async uploadDomusDocument(
    @UploadedFile() file: Express.Multer.File,
    @Body('database') database: string,
    @Body('collection') collection: string,
  ): Promise<void> {
    if (!file) throw new Error('No se adjuntó ningún archivo');
    const data = await this.embeddingService.splitTextParagraphs(file.buffer.toString());
    const name = file.originalname.substring(0, file.originalname.lastIndexOf('.'));
    const extra = { building: name };
    await this.embeddingService.registerEmbeddingsAtlas(data, database, collection, extra);
  }
  
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
  ): Promise<void> {
    await this.embeddingService.createAtlasVectorIndex(database, collection, index);
  }

  @Post('vector-query-atlas')
  async vectorQueryAtlas(
    @Body('query') query: string,
    @Body('database') database: string,
    @Body('collection') collection: string,
    @Body('index') index: string,
  ): Promise<any> {
    return await this.embeddingService.vectorQueryAtlas(query, database, collection, index);
  }

  @Post('split-text-paragraphs')
  @UseInterceptors(FileInterceptor('file'))
  async splitTextParagraphs(@UploadedFile() file: Express.Multer.File): Promise<string[]> {
    if (!file) throw new Error('No se adjuntó ningún archivo');
    return await this.embeddingService.splitTextParagraphs(file.buffer.toString());
  }
}