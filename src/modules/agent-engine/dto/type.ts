export type MessageOriginType =
  | "inbox"
  | "group"
;

export type RoleType =
  | "user"
  | "assistant"
;

export type ParameterType =
  | "string"
  | "number"
  | "date"
;

export type MessageType =
  | "text"
  | "audio"
  | "image"
  | "document"
;

export type ProviderType =
  | "official"
  | "unofficial"
;

export type Provider =
  | "evolution-api"
  | "evolution-official"
  | "waapi"
  | "whatsapp-cloud-api"
  | "bubble-chat"
;