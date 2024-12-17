import { OpenAIEmbeddings } from '@langchain/openai';
import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter';
import { Index, Pinecone } from "@pinecone-database/pinecone";
import { Injectable } from "@nestjs/common";
import { Document, MongoClient, SearchIndexDescription } from 'mongodb';
import { CreateIndexSpec } from '@pinecone-database/pinecone/dist/control';

@Injectable()
export class EmbeddingService {
  private readonly embedding: OpenAIEmbeddings;
  private readonly picone: Pinecone;
  private mongo: MongoClient;

  constructor() {
    this.embedding = new OpenAIEmbeddings({
      openAIApiKey: process.env.OPENAI_API_KEY,
    });

    this.picone = new Pinecone({
      apiKey: process.env.PICONE_API_KEY,
    });
    
    this.mongo = new MongoClient(
      process.env.ATLAS_CONNECTION_STRING
    );
  }

  // General

  async onModuleInit() {
    await this.mongo.connect();
  }

  async createEmbedding(text: string): Promise<number[]> {
    const embedding = await this.embedding.embedQuery(text);
    return embedding;
  }

  async splitTextParagraphs(content: string): Promise<string[]> {
    try {
      const textSplitter = new RecursiveCharacterTextSplitter({
        chunkSize: 500,
        chunkOverlap: 50,
      });
      const chunks = textSplitter.splitText(content);
      return chunks;
    } catch (error) {
      console.error('Error procesando el archivo:', error);
      throw new Error('No se pudo procesar el archivo');
    }
  }

  // Atlas
  
  async registerEmbeddingsAtlas(
    data: string[],
    database: string,
    collection: string,
    extra: Record<string, any>,
  ): Promise<void> {
    const ref = this.mongo.db(database).collection(collection);

    await Promise.all(data.map(async (text) => {
      const doc = await ref.findOne({ text });
      if (!doc) {
        const embedding = await this.createEmbedding(text);
        await ref.insertOne({ text, embedding, ...extra });
        console.log(`Insertado: ${text}`);
      } else {
        console.log(`El texto "${text}" ya existe en la colección.`);
      }
    }));
  }
  

  async createAtlasVectorIndex(database: string, collection: string, index: string): Promise<void> {
    const ref = this.mongo.db(database).collection(collection);

    const indexDefinition: SearchIndexDescription = {
      name: index,
      type: "vectorSearch",
      definition: {
        fields: [
          {
            type: "vector",
            path: "embedding",
            similarity: "dotProduct",
            numDimensions: 1536,
          }
        ]
      }
    };

    const result = await ref.createSearchIndex(indexDefinition);
    console.log("Índice creado:", result);
  }

  async vectorQueryAtlas(query: string, database: string, collection: string, index: string) {
    const db = this.mongo.db(database);
    const ref = db.collection(collection);

    const queryEmbedding = await this.createEmbedding(query);

    const pipeline: Document[] = [
      {
        $vectorSearch: {
          index: index,
          queryVector: queryEmbedding,
          path: "embedding",
          exact: true,
          limit: 2,
        }
      },
      {
        $project: {
          _id: 0,
          text: 1,
          score: { $meta: "vectorSearchScore" }
        }
      }
    ];

    const cursor = ref.aggregate(pipeline);
    const results = [];
    for await (const doc of cursor) {
      results.push(doc);
    }
    return results;
  }

  // Pinecone Methods

  async createPineconeIndex(index: string, dimension: number): Promise<void> {
    const spec: CreateIndexSpec = {
      serverless: {
        cloud: "aws",
        region: "us-west-2",
      }    
    }
    const response = await this.picone.createIndex({
      name: index,
      dimension: dimension,
      spec: spec,
    });
    console.log(`Índice Pinecone "${index}" creado:`, response);
  }

  async registerEmbeddingsPinecone(
    data: string[], 
    index: string,
    extra: Record<string, any>,
  ): Promise<void> {
    const ref: Index = this.picone.Index(index);
    const vectors = await Promise.all(data.map(async (text) => {
      const embedding = await this.createEmbedding(text);
      return {
        id: text,                       // ID único para el vector (usamos el texto original)
        values: embedding,              // El vector numérico
        metadata: { text, ...extra },   // Metadata opcional, guardamos el texto original
      };
    }));
    await ref.upsert(vectors);
    console.log(`Insertados ${vectors.length} vectores en Pinecone en el índice "${index}".`);
  }

  async vectorQueryPinecone(query: string, index: string, topK = 5) {
    const ref: Index = this.picone.Index(index);
    const queryEmbedding = await this.createEmbedding(query);

    const result = await ref.query({
      vector: queryEmbedding,
      topK,
      includeMetadata: true,
    });
    return result.matches;
  }

}
