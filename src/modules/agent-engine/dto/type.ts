export enum MessageOriginType {
    INBOX = "inbox",
    GROUP = "group",
  }
  
  export enum RoleType {
    USER = "user",
    ASSISTANT = "assistant",
  }
  
  export enum ParameterType {
    STRING = "string",
    NUMBER = "number",
    DATE = "date",
  }
  
  export enum MessageType {
    TEXT = "text",
    AUDIO = "audio",
    IMAGE = "image",
    DOCUMENT = "document",
  }
  
  export enum ProviderType {
    OFFICIAL = "official",
    UNOFFICIAL = "unofficial",
  }
  
  export type Provider =
    | "evolution-api"
    | "evolution-official"
    | "waapi"
    | "whatsapp-cloud-api"
    | "bubble-chat";
  