import { ClientService } from '../client/client.service';
import { Injectable } from '@nestjs/common';
import { z } from 'zod';
import { PromptTemplate } from '@langchain/core/prompts';
import { StructuredOutputParser } from 'langchain/output_parsers';
import { LlmModel } from '../client/dto/client.dto';
import { BaseMessage } from '@langchain/core/messages';

@Injectable()
export class SchemaService {


  constructor(
    private readonly clientService: ClientService,
  ) {}

  async getObjectFromMessages(
    schema: z.ZodObject<any>,
    model: LlmModel,
    messages: BaseMessage[],
  ) {
    const llm = this.clientService.getLlm(model);
    const structuredLlm = llm.withStructuredOutput(schema);
    const response = await structuredLlm.invoke(messages);
    return response;
  }

  async getObjectFromConversation(
    conversation: string,
    instruction: string,
    schema: z.ZodObject<any>,
    model: LlmModel
  ) {
    const parser = StructuredOutputParser.fromZodSchema(schema);
    const prompt_base = this.getPromptBaseInput();
    
    const prompt = new PromptTemplate({
      template: prompt_base + instruction,
      inputVariables: ['conversation'],
      partialVariables: { format_instructions: parser.getFormatInstructions() },
    });

    const llm = this.clientService.getLlm(model);
    const chain = prompt.pipe(llm).pipe(parser);

    return await chain.invoke({ conversation: conversation });
  }

  async getObjectFromInput(
    input: string,
    instruction: string,
    schema: z.ZodObject<any>,
    model: LlmModel
  ) {
    const parser = StructuredOutputParser.fromZodSchema(schema);
    const prompt_base = this.getPromptBaseInput();
    
    const prompt = new PromptTemplate({
      template: prompt_base + instruction,
      inputVariables: ['input'],
      partialVariables: { format_instructions: parser.getFormatInstructions() },
    });

    const llm = this.clientService.getLlm(model);
    const chain = prompt.pipe(llm).pipe(parser);

    return await chain.invoke({ input: input });
  }

  getPromptBaseConveration() {
    return `Extrae los datos relevantes del siguiente texto:
    {format_instructions}
    
    Historial Completo:
    {conversation}
    
    Reglas:
    - Extrae toda la información relevante
    - Si un dato no existe, devuelve cadena vacía ("")
    - Usa exactamente los campos del schema
    
    Instrucciones:
    `;
  }

  getPromptBaseInput() {
    return `Extrae los datos relevantes del siguiente texto:
    {format_instructions}
    
    Historial Completo:
    {input}
    
    Reglas:
    - Extrae toda la información relevante
    - Si un dato no existe, devuelve cadena vacía ("")
    - Usa exactamente los campos del schema
    
    Instrucciones:
    `;
  }
}