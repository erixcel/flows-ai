import { TemplateType } from "./type"

export class Template {
  template_type: TemplateType
}

export class SendText extends Template {
  template_type: TemplateType = "send_text"
  messaging_product: string = "whatsapp"
  recipient_type: string = "individual"
  to: string
  type: string = "text"
  text = {
    preview_url: false,
    body: "",
  }
}

export class SendMediaURL extends Template {
  template_type: TemplateType = "send_media"
  
}

export class SendLocation extends Template{
  template_type: TemplateType = "send_location"

}