import { MessageType, ProviderType, WhatsappType } from "./type";

export interface Entry {
  is_test: boolean;
  code: string;
  whatsapp_type: WhatsappType;
  provider_type: ProviderType;
  from_me: boolean;
  phone_bot: string;
  phone_user: string;
  remote_id: string;
  group_id?: string;
  waba_id: string;
  pushname?: string;
  text?: string;
  type?: MessageType;
  media?: MediaMessage;
  quoted?: Quoted;
  mentioned_phones?: string[];
}

export interface Quoted {
  code: string;
  phone: string;
  text?: string;
  type?: MessageType;
  media?: MediaMessage;
  mentioned_phones?: string[];
}

export interface MediaMessage {
  id?: string;
  url?: string;
  base64?: string;
  sha256?: string;
  mime_type?: string;
  caption?: string;
  animated?: boolean;
}