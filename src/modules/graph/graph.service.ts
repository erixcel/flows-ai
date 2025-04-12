import { Injectable } from '@nestjs/common';
import { StateGraph, START, END, Annotation } from '@langchain/langgraph';
import { ChatOpenAI } from '@langchain/openai';
import { PromptTemplate } from '@langchain/core/prompts';
import { StructuredOutputParser } from 'langchain/output_parsers';
import { z } from 'zod';
import { ChatService } from '../chat/chat.service';

@Injectable()
export class GraphService {
  // Categorías definidas en el ejemplo original.
  categories = ['medical', 'cinema'] as const;
  
  private readonly categorySchema = z.object({
    name: z.enum(this.categories).describe("Tipo de solicitud")
  });

  private readonly medicalSchema = z.object({
    hora: z.string().describe("Hora de la cita"),
    personas: z.number().describe("Número de personas"),
    edades: z.array(z.number()).describe("Edades de los pacientes"),
    parentesco: z.string().describe("Parentesco del solicitante")
  });

  private readonly cinemaSchema = z.object({
    hora: z.string().describe("Hora de la función"),
    personas: z.number().describe("Número de entradas"),
    pelicula: z.string().describe("Nombre de la película"),
    tipo_entrada: z.array(z.string()).describe("Tipos de entrada")
  });

  private readonly stateDefinition = Annotation.Root({
    userInput: Annotation({
      reducer: (prev: string, next: string) => next,
      default: () => '',
    }),
    category: Annotation({
      reducer: (prev: typeof this.categories[number], next: typeof this.categories[number]) => next,
      default: () => '',
    }),
    medicalDetails: Annotation({
      reducer: (prev: z.infer<typeof this.medicalSchema>, next: z.infer<typeof this.medicalSchema>) => next,
      default: () => ({}),
    }),
    cinemaDetails: Annotation({
      reducer: (prev: z.infer<typeof this.cinemaSchema>, next: z.infer<typeof this.cinemaSchema>) => next,
      default: () => ({}),
    }),
    finalResponse: Annotation({
      reducer: (prev: any, next: any) => next,
      default: () => ({}),
    }),
  });

  // Inyección de ChatService
  constructor(private readonly chatService: ChatService) {}

  private async classifyInput(state: typeof this.stateDefinition.State) {
    const parser = StructuredOutputParser.fromZodSchema(this.categorySchema);
    
    const prompt = new PromptTemplate({
      template: `Clasifica la siguiente solicitud como "medical" o "cinema".\n{format_instructions}\nSolicitud: {input}`,
      inputVariables: ['input'],
      partialVariables: { format_instructions: parser.getFormatInstructions() },
    });

    const model = new ChatOpenAI({
      modelName: 'gpt-4o-mini',
      temperature: 0,
    });

    const chain = prompt.pipe(model).pipe(parser);
    
    const result = await chain.invoke({
      input: state.userInput,
    });

    return {
      ...state,
      category: result.name,
    };
  }

  private async handleMedical(state: typeof this.stateDefinition.State) {
    const parser = StructuredOutputParser.fromZodSchema(this.medicalSchema);
    
    const prompt = new PromptTemplate({
      template: `Extrae información de cita médica:\n{format_instructions}\nSolicitud: {input}`,
      inputVariables: ['input'],
      partialVariables: { format_instructions: parser.getFormatInstructions() },
    });

    const model = new ChatOpenAI({
      modelName: 'gpt-4o-mini',
      temperature: 0,
    });

    const chain = prompt.pipe(model).pipe(parser);
    
    const result = await chain.invoke({
      input: state.userInput,
    });

    return {
      ...state,
      medicalDetails: result,
    };
  }

  private async handleCinema(state: typeof this.stateDefinition.State) {
    const parser = StructuredOutputParser.fromZodSchema(this.cinemaSchema);
    
    const prompt = new PromptTemplate({
      template: `Extrae información de cita al cine:\n{format_instructions}\nSolicitud: {input}`,
      inputVariables: ['input'],
      partialVariables: { format_instructions: parser.getFormatInstructions() },
    });

    const model = new ChatOpenAI({
      modelName: 'gpt-4o-mini',
      temperature: 0,
    });

    const chain = prompt.pipe(model).pipe(parser);
    
    const result = await chain.invoke({
      input: state.userInput,
    });

    return {
      ...state,
      cinemaDetails: result,
    };
  }

  private async finalResponse(state: typeof this.stateDefinition.State) {
    return {
      ...state,
      finalResponse: state.category === 'medical' 
        ? { tipo: 'medical', datos: state.medicalDetails }
        : { tipo: 'cinema', datos: state.cinemaDetails }
    };
  }

  async processRequest(userInput: string) {
    const workflow = new StateGraph(this.stateDefinition)

      .addNode('classify', this.classifyInput.bind(this))
      .addNode('handle_medical', this.handleMedical.bind(this))
      .addNode('handle_cinema', this.handleCinema.bind(this))
      .addNode('final_response', this.finalResponse.bind(this))

      .addEdge(START, 'classify')
      .addConditionalEdges(
        'classify',
        (state) => state.category,
        {
          medical: 'handle_medical',
          cinema: 'handle_cinema'
        }
      )
      .addEdge('handle_medical', 'final_response')
      .addEdge('handle_cinema', 'final_response')
      .addEdge('final_response', END);

    const app = workflow.compile();

    const initialState = {
      userInput: userInput,
      category: 'medical' as typeof this.categories[number],
      medicalDetails: {},
      cinemaDetails: {},
      finalResponse: {},
    };

    const result = await app.invoke(initialState);
    return result.finalResponse;
  }


  async processConversationWithAppointment(input: string, sessionId: string): Promise<{ 
    response: string, 
    data: { 
      fecha?: string, 
      nombre?: string, 
      horario?: string
    } 
  }> {

    const chatResponse = await this.chatService.handleBasicConversation(input, sessionId);
    const userMemory = this.chatService.getUserMemory(sessionId);
    const memoryVariables = await userMemory.loadMemoryVariables({sessionId});
    const fullConversationHistory = memoryVariables[userMemory.memoryKey] || "";

    const appointmentSchema = z.object({
      fecha: z.string().describe("Fecha de la cita en formato DD/MM/YYYY").default(""),
      nombre: z.string().describe("Nombre completo del paciente").default(""),
      horario: z.string().describe("Horario en formato HH:MM").default(""),
    });

    const parser = StructuredOutputParser.fromZodSchema(appointmentSchema);
    
    const extractionPrompt = new PromptTemplate({
      template: `Extrae los datos relevantes de TODO el historial de conversación:
      {format_instructions}
      
      Historial completo:
      {conversation}
      
      Reglas:
      - Extrae información de TODA la conversación
      - Si un dato no existe, devuelve cadena vacía ("")
      - Usa exactamente los campos del schema`,
      inputVariables: ['conversation'],
      partialVariables: { format_instructions: parser.getFormatInstructions() },
    });

    const model = new ChatOpenAI({
      modelName: 'gpt-4o-mini',
      temperature: 0,
    });
    
    const extractionChain = extractionPrompt.pipe(model).pipe(parser);
    const appointmentData = await extractionChain.invoke({ conversation: fullConversationHistory });
    
    return {
      response: chatResponse,
      data: appointmentData
    };
}
}
