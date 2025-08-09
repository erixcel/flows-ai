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

export type WhatsappType =
  | "official"
  | "unofficial"
;

export type ProviderType =
  | "evolution"
  | "waapi"
  | "meta"
  | "bubble_chat"
;

export type TemplateType =
  | "send_text"
  | "send_media"
  | "send_location"