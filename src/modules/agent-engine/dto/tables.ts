import { LlmModel } from "src/modules/client/dto/client.dto";
import { MessageType, ProviderType, RoleType } from "./type";
import { MediaMessage, Quoted } from "./agent";

export class Bot {
  id: string;
  name: string;
  prompt: string;
  phone: string;
  model: LlmModel;
}

export class Provider {
  id: string;
  name: string;
}

export class BotProvider {
  bot_id: string;
  provider_id: string;
  type: ProviderType;
  instance_uuid: string;
  instance_name: string;
  instance_key: string;
  instance_server: string;
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