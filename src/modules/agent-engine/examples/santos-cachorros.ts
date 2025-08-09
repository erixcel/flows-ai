import { NodePayload } from "../model/agent";

export const santos_cachorros: NodePayload = {
    entry: {
        is_test: false,
        code: 'XXXXX_XXXX1',
        whatsapp_type: 'official',
        provider_type: 'meta',
        from_me: false,
        phone_bot: '51919615220',
        phone_user: '51929073820',
        remote_id: '51929073820',
        group_id: null,
        pushname: 'Erick Flores',
        waba_id: 'XXXXX_XXXX1',
        type: 'text',
        text: 'en que me puedes ayudar?',
        media: {},
        mentioned_phones: [],
        quoted: null,
    },
    bot: {
        id: 'bot-1',
        name: 'Santos Cachorros',
        model: 'gemini',
        prompt: 'Eres un asistente personal de la veterinaria Santos Cachorros, debes responder a las preguntas de los usuarios de manera amigable y profesional.',
    },
    user: {
        id: 'user-1',
        phone: '51929073820',
    },
    instance: {
        bot_id: 'bot-1',
        provider_type: 'meta',
        whatsapp_type: 'official',
        business_id: 'XXXXX_XXXX1',
        phone_number_id: 'XXXXX_XXXX1',
        waba_id: 'XXXXX_XXXX1',
        display_phone_number: '51919615220',
        token: 'XXXXX_XXXX1',
    },
    chat: {
        id: 'chat-1',
        created: new Date().toISOString(),
        bot_id: 'bot-1',
        user_id: 'user-1',
        remote: '51929073820@s.whatsapp.net',
        enabled: true,
    },
    messages: []
}