import { Bot } from "grammy";

import { config } from "./config/env.js";
import { adminsIds } from "./config/constants.js";

import { conversations, createConversation } from "@grammyjs/conversations";

import { getFullKeyboard } from "./keyboards/getBasicKeyboards.js";

import { search } from "./handlers/search.js";
import { start } from "./handlers/start.js";
import { myTrips } from "./handlers/mytrips.js";
import { joinToTrip } from "./handlers/joinToTrip.js";
import { leaveFromTrip } from "./handlers/leaveFromTrip.js";
import { createTripDialog } from "./handlers/createTrip.js";
import { Calendar } from "telegram-inline-calendar";

const bot = new Bot(config.botToken);

bot.use(conversations());

export const calendar = new Calendar(bot, {
    date_format: "DD.MM.YYYY HH:mm",
    language: "uk",
    bot_api: "grammy",
    time_selector_mod: true,
    time_step: "30m",
    start_date: "now",
    start_week_day: 1,
});

bot.hears("Стоп ⛔", async (ctx) => {
    const active = await ctx.conversation.active();

    if (Object.keys(active).length > 0) {
        await ctx.conversation.exitAll();
        await ctx.reply("Створення поїздки скасовано", { reply_markup: getFullKeyboard(ctx.from.id) });
        return;
    }

    await ctx.reply("Ви нічого не створюєте");
});

bot.use(createConversation(createTripDialog, "createTrip"));

bot.command("start", (ctx) => start(ctx));

bot.hears('🔍 Знати поїздки', (ctx) => search(ctx));
bot.hears('🚗 Мої поїздки', (ctx) => myTrips(ctx));
bot.hears('Створити гру ➕', async (ctx) => {
    if (adminsIds.includes(ctx.from.id)) {
        await ctx.conversation.enter("createTrip");
    } else {
        await ctx.reply("Поїздки може створювати тільки адмін")
    }
});

bot.callbackQuery(/^join_to_(.+)$/, joinToTrip);
bot.callbackQuery(/^leave_from_(.+)$/, leaveFromTrip);

bot.start();