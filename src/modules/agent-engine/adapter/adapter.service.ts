import { Injectable } from "@nestjs/common";
import { EntryMeta } from "../model/meta";
import { Entry, MediaMessage, Quoted } from "../model/entry";
import { MessageType } from "../model/type";

@Injectable()
export class AdapterService {

    adaptEntryMeta(entryMeta: EntryMeta): Entry {

        const code = entryMeta.entry[0].changes[0].value.messages[0].id;
        const phone_bot = entryMeta.entry[0].changes[0].value.metadata?.display_phone_number;
        const phone_user = entryMeta.entry[0].changes[0].value.contacts[0].wa_id;
        const waba_id = entryMeta.entry[0].id;
        const pushname = entryMeta.entry[0].changes[0].value.contacts[0].profile?.name;
        const type = entryMeta.entry[0].changes[0].value.messages[0].type as MessageType;

        const quoted: Quoted = {
            code: entryMeta.entry[0].changes[0].value.messages[0].context?.id,
            phone: entryMeta.entry[0].changes[0].value.messages[0].context?.from
        };

        let media: MediaMessage;

        if (entryMeta.entry[0].changes[0].value.messages[0].type === "image") {
            media = entryMeta.entry[0].changes[0].value.messages[0].image;
        }

        if (entryMeta.entry[0].changes[0].value.messages[0].type === "sticker") {
            media = entryMeta.entry[0].changes[0].value.messages[0].sticker;
        }

        if (entryMeta.entry[0].changes[0].value.messages[0].type === "document") {
            media = entryMeta.entry[0].changes[0].value.messages[0].document;
        }

        let text: string;

        if (entryMeta.entry[0].changes[0].value.messages[0].type === "text") {
            text = entryMeta.entry[0].changes[0].value.messages[0].text.body;
        }

        const entry: Entry = {
            is_test: false,
            code: code,
            whatsapp_type: "official",
            provider_type: "meta",
            from_me: false,
            phone_bot: phone_bot,
            phone_user: phone_user,
            remote_id: phone_user,
            group_id: null,
            waba_id: waba_id,
            pushname: pushname,
            text: text,
            type: type,
            media: media,
            quoted: quoted,
            mentioned_phones: null
        }

        console.log("ADAPTER ENTRY: ", entry);

        return entry;
    }
}