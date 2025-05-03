export type TemplateId =
  | "send_text_evolution"
  | "send_media_url_evolution"
  | "send_location_evolution"

export interface Template {
  template_id?: TemplateId
  [key: string]: any
}

export class SendText {
  template_id: TemplateId = "send_text_evolution"
  number: string
  text: string
  delay?: number
  quoted?: {
    key: {
      id: string
    }
    message: {
      conversation: string
    }
  }
  linkPreview?: boolean
  mentionsEveryOne?: boolean
  mentioned?: string[]
}

export class SendMediaURL {
  template_id: TemplateId = "send_media_url_evolution"
  number: string
  mediatype: string = "image"
  mimetype: string = "image/png"
  caption: string = ""
  media: string
  fileName: string = "imagen.png"
  delay?: number
  quoted?: {
    key: {
      id: string
    }
    message: {
      conversation: string
    }
  }
  mentionsEveryOne?: boolean
  mentioned?: string[]
}

export class SendLocation {
  template_id: TemplateId = "send_location_evolution"
  number: string
  name: string
  address: string
  latitude: number
  longitude: number
  delay?: number
  quoted?: {
    key: {
      id: string
    }
    message: {
      conversation: string
    }
  }
  mentionsEveryOne?: boolean
  mentioned?: string[]
}