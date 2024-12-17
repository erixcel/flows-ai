import { Injectable } from '@nestjs/common';
import { Flow, FlowResult } from './class/flow';

@Injectable()
export class FlowService extends Flow {

    constructor() {
      super();
      this.configure({
        stages: {
          general: [
            "processEntry", 
            "processUser", 
            "processBot", 
            "processChat",
            "processWhatsApp",
          ],
          action_pre_run: [
            "processAction",
            "processWebhook",
            "processWhatsApp",
          ],
        },
        steps: {
          processEntry: this.processEntry.bind(this),
          processUser: this.processUser.bind(this),
          processBot: this.processBot.bind(this),
          processChat: this.processChat.bind(this),
          processAction: this.processAction.bind(this),
          processWebhook: this.processWebhook.bind(this),
          processWhatsApp: this.processWhatsApp.bind(this),
        },
        context: {
          contador: 0,
          mensaje: "Iniciando flujo"
        }
      });
    }
  
    processEntry(ctx: Record<string, any>): FlowResult {
      console.log("Se valido la entrada de WhatsApp");
      ctx.contador++;
    }
  
    processUser(ctx: Record<string, any>): FlowResult {
      console.log("El usuario es valido");
      ctx.contador++;
    }
  
    processBot(ctx: Record<string, any>): FlowResult {
      console.log("El bot es valido");
      ctx.contador++;
    }
  
    processChat(ctx: Record<string, any>): FlowResult {
      console.log("Se creo el chat");
      ctx.contador++;
      return { stageName: "action_initial", stepName: "processAction" };
    }
  
    processAction(ctx: Record<string, any>): FlowResult {
      console.log("Se creo la accion");
      ctx.contador++;
    }
  
    processWebhook(ctx: Record<string, any>): FlowResult {
      console.log("Se completo el webhook");
      ctx.contador++;
    }

    processWhatsApp(ctx: Record<string, any>): FlowResult {
      console.log("Se envio una respuesta por WhatsApp");
      ctx.contador++;
    }
}