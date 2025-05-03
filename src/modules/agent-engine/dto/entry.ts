import { Bot, BotProvider, Chat, Message, User } from "./agent";
import { Template } from "./templates";
import { MessageType, ProviderType } from "./type";

export interface NodeResponse {
  status: boolean;
  templates?: Template[];
}

export interface NodePayload {
  entry: Entry;
  bot?: Bot;
  user?: User;
  bot_provider?: BotProvider;
  chat?: Chat;
  messages?: Message[];
}

export interface Entry {
  is_test: boolean;
  code: string;
  from_me: boolean;
  phone_bot: string;
  phone_user: string;
  remote_id: string;
  instance_id: string;
  instance_name: string;
  instance_server: string;
  instance_key: string;
  provider_type: ProviderType;
  pushname_user?: string;
  group_id?: string;
  text?: string;
  type?: MessageType;
  media?: MediaEntry;
  quoted?: Quoted;
  mentioned_phones?: string[];
}

export interface Quoted {
  phone: string;
  text?: string;
  type?: MessageType;
  media?: MediaMessage;
  mentioned_phones?: string[];
}

// Tipado para los elementos que almacenará el campo media en el entry formateado
export interface MediaEntry {
  url?: string;
  base64?: string;
  fileName?: string;
  mimeType?: string;
  mediaId?: string;
  messageTimestamp?: string;

}

//Datos de la imagen que se almacenan en campo media de la tabla message
export interface MediaMessage { 
  url?: string;
  description?: string;
  base64?: string;
  messageTimestamp?: string;
  mimeType?: string;
  caption?: string;

}
