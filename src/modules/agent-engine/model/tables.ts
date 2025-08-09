import { LlmModel } from "src/modules/client/dto/client.dto";
import { MessageType, ParameterType, ProviderType, RoleType, WhatsappType } from "./type";
import { MediaMessage, Quoted } from "./entry";

export class Bot {
  id: string;
  name: string;
  prompt: string;
  model: LlmModel;
}

export class Instance {
  bot_id: string;
  whatsapp_type: WhatsappType;
  provider_type: ProviderType;
  business_id: string;
  phone_number_id: string;
  display_phone_number: string;
  waba_id: string;
  token: string;
}

export class User {
  id: string;
  phone: string;
}

export class Chat {
  id: string;
  created: string;
  enabled: boolean;
  remote: string;
  bot_id: string;
  user_id: string;
}

export class Message {
  id: string;
  code: string;
  role: RoleType;
  text: string;
  type: MessageType;
  media: MediaMessage;
  quoted: Quoted;
  chat_id: string;
}

export class Action {
  id: string;
  name: string;
  description: string;
  parameters: Parameter[];
}

export class ActionChat {
  id: string;
  action_id: string;
  chat_id: string;
}

export class Parameter {
  id: string;
  name: string;
  slug: string;
  type: ParameterType;
}