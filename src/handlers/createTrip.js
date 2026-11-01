import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat.js";

import { calendar } from "../index.js";

import { getFullKeyboard } from "../keyboards/getBasicKeyboards.js";
import { getStopDialogKeyboard } from "../keyboards/getStopDialogKeyboard.js";

import { createTrip } from "../services/tripService.js";

dayjs.extend(customParseFormat);

async function askText(conversation, ctx, question) {
    await ctx.reply(question, { reply_markup: getStopDialogKeyboard() });
    const { message } = await conversation.waitFor("message:text");
    const text = message.text.trim();

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

async function askDate(conversation, ctx) {
    while (true) {
        await calendar.startNavCalendar(ctx);

        let res = -1;
        while (res === -1) {
            const cb = await conversation.waitFor("callback_query:data", "message:text");

            if (cb.msg?.message_id !== calendar.chats.get(cb.chat.id)) continue;

            res = calendar.clickButtonCalendar(cb);
        }

        const parsed = dayjs(res, "DD.MM.YYYY HH:mm", true);

        if (!parsed.isValid()) {
            await ctx.reply("Не вдалося розпізнати дату, оберіть ще раз.");
            continue;
        }

        if (parsed.isBefore(dayjs(await conversation.now()))) {
            await ctx.reply("Цей час вже минув, оберіть ще раз.");
            continue;
        }

        return parsed.toISOString();
    }
}

export async function createTripDialog(conversation, ctx) {
    const title = await askText(
        conversation, ctx,
        "Введіть заголовок для поїздки (або натисніть «Стоп» для скасування):"
    );

    const date = await askDate(conversation, ctx);

    const description = await askText(conversation, ctx, "Введіть опис поїздки:");

    const difficultyLevel = await askNumber(
        conversation, ctx,
        "Введіть важкість поїздки від 1 до 5:",
        { min: 1, max: 5, integer: true }
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
    };

    try {
        await conversation.external(() => createTrip(newTrip));
    } catch (error) {
        console.error(error);
        await ctx.reply("Не вдалося зберегти поїздку. Спробуйте ще раз пізніше.", { reply_markup: getFullKeyboard(ctx.update.message.from.id) });
        return;
    }

    await ctx.reply(`Поїздку «${title}» створено ✅`, { reply_markup: getFullKeyboard(ctx.from.id) });
}