import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat.js";

import { addTripToTrips } from "../services/addNewTrip.js";
import { calendar } from "../index.js";

dayjs.extend(customParseFormat);

// Кидається, коли користувач пише "Стоп"
class StopError extends Error {}

// ---------- допоміжні функції ----------

async function askText(conversation, ctx, question) {
    await ctx.reply(question);
    const { message } = await conversation.waitFor("message:text");
    const text = message.text.trim();

    if (text.toLowerCase() === "стоп") throw new StopError();

    return text;
}

async function askNumber(conversation, ctx, question, { min, max, integer = false }) {
    while (true) {
        const text = await askText(conversation, ctx, question);
        const value = Number(text.replace(",", "."));

        const valid =
            Number.isFinite(value) &&
            value >= min &&
            value <= max &&
            (!integer || Number.isInteger(value));

        if (valid) return value;

        await ctx.reply(`Введіть ${integer ? "ціле " : ""}число від ${min} до ${max}.`);
    }
}

async function askUrl(conversation, ctx, question) {
    while (true) {
        const text = await askText(conversation, ctx, question);

        try {
            const url = new URL(text);
            if (url.protocol === "http:" || url.protocol === "https:") return text;
        } catch {
            // не посилання, питаємо ще раз
        }

        await ctx.reply("Це не схоже на посилання. Приклад: https://maps.google.com/...");
    }
}

async function askYesNo(conversation, ctx, question) {
    while (true) {
        const answer = (await askText(conversation, ctx, question)).toLowerCase();

        if (answer === "так") return true;
        if (answer === "ні") return false;

        await ctx.reply("Напишіть «так» або «ні».");
    }
}

async function askDate(conversation, ctx) {
    while (true) {
        // показати календар один раз (не при кожному перегравання діалогу)
        // Календар надсилає повідомлення через ctx, тому ці виклики НЕ можна
        // обгортати в conversation.external(): плагін записує їх як звичайні
        // дії діалогу й при перегравання підставляє збережений результат.
        await calendar.startNavCalendar(ctx);

        // чекати натискань, поки не буде обрано дату й час
        let res = -1;
        while (res === -1) {
            const cb = await conversation.waitFor("callback_query:data");

            // натискання не на нашому календарі (старе повідомлення тощо)
            if (cb.msg?.message_id !== calendar.chats.get(cb.chat.id)) continue;

            res = calendar.clickButtonCalendar(cb);
        }

        const parsed = dayjs(res, "DD.MM.YYYY HH:mm", true);

        if (!parsed.isValid()) {
            await ctx.reply("Не вдалося розпізнати дату, оберіть ще раз.");
            continue;
        }
        if (parsed.isBefore(dayjs())) {
            await ctx.reply("Цей час вже минув, оберіть ще раз.");
            continue;
        }

        return parsed.toISOString();
    }
}

// ---------- основний діалог ----------

export async function createTrip(conversation, ctx) {
    try {
        const title = await askText(
            conversation, ctx,
            "Введіть заголовок для поїздки (або «Стоп» для скасування):"
        );

        const date = await askDate(conversation, ctx);

        const description = await askText(conversation, ctx, "Введіть опис поїздки:");

        const difficultyLevel = await askNumber(
            conversation, ctx,
            "Введіть важкість поїздки від 1 до 5:",
            { min: 1, max: 10, integer: true }
        );

        const price = await askNumber(
            conversation, ctx,
            "Введіть ціну за людину:",
            { min: 0, max: 100000 }
        );

        const destinationName = await askText(conversation, ctx, "Введіть місце призначення:");
        const destinationUrl = await askUrl(conversation, ctx, "Введіть посилання на місце призначення:");

        const startPointName = await askText(conversation, ctx, "Введіть місце збору (початку):");
        const startPointUrl = await askUrl(conversation, ctx, "Введіть посилання на місце збору:");

        const maxParticipants = await askNumber(
            conversation, ctx,
            "Введіть максимальну кількість учасників:",
            { min: 1, max: 100, integer: true }
        );

        const transfer = await askYesNo(conversation, ctx, "Чи доступний трансфер? (так або ні)");

        const newTrip = {
            started_at: date,
            title,
            description,
            difficulty_level: difficultyLevel,
            price: price.toFixed(2),
            destination_name: destinationName,
            destination_url: destinationUrl,
            start_point_name: startPointName,
            start_point_url: startPointUrl,
            max_participants: maxParticipants,
            transfer,
        };

        try {
            // запис у базу виконується рівно один раз
            await conversation.external(() => addTripToTrips(newTrip));
        } catch (error) {
            console.error(error);
            await ctx.reply("Не вдалося зберегти поїздку. Спробуйте ще раз пізніше.");
            return;
        }

        await ctx.reply(`Поїздку «${title}» створено ✅`);
    } catch (error) {
        if (error instanceof StopError) {
            await ctx.reply("Створення поїздки скасовано.");
            return;
        }
        throw error;
    }
}