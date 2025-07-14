import { NodePayload } from "../dto/agent";

export const santos_cachorros: NodePayload = {
    entry: {
        is_local: true,
        is_test: false,
        from_me: false,
        phone_bot: '51919615220',
        phone_user: '51929073820',
        provider_type: 'official',
        remote_id: '51929073820@s.whatsapp.net',
        group_id: null,
        pushname_user: 'Erick Flores',
        code: 'CODE_00001',
        instance_uuid: 'INTANCE_UUID_00001',
        instance_key: 'INTANCE_KEY_00001',
        instance_name: 'INTANCE_NAME_00001',
        instance_server: 'INTANCE_SERVER_00001',
        type: 'text',
        text: 'Hola como estas?',
        media: {},
        mentioned_phones: [],
        quoted: null,
    },
    bot: {
        id: '1',
        name: 'Santos Cachorros',
        model: 'gpt',
        phone: '51919615220',
        prompt: 'Eres un asistente personal de la veterinaria Santos Cachorros, debes responder a las preguntas de los usuarios de manera amigable y profesional.',
    },
    user: {
        id: '1',
        phone: '51929073820',
    },
    bot_provider: {
        bot_id: '1',
        provider_id: '1',
        type: 'official',
        instance_uuid: 'INTANCE_UUID_00001',
        instance_key: 'INTANCE_KEY_00001',
        instance_name: 'INTANCE_NAME_00001',
        instance_server: 'INTANCE_SERVER_00001',
    },
    chat: {
        id: '1',
        created: new Date().toISOString(),
        bot_id: '1',
        user_id: '1',
        remote: '51929073820@s.whatsapp.net',
        enabled: true,
    },
    messages: []
}