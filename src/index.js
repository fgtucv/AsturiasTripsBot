import { Bot } from "grammy";
import { config } from "./config/env.js";

import { conversations, createConversation } from "@grammyjs/conversations";

import { search } from "./handlers/search.js";
import { start } from "./handlers/start.js";
import { myTrips } from "./handlers/mytrips.js";
import { joinToTrip } from "./handlers/joinToTrip.js";
import { leaveFromTrip } from "./handlers/leaveFromTrip.js";
import { createTrip } from "./handlers/createTrip.js";
import { Calendar } from "telegram-inline-calendar";

const bot = new Bot(config.botToken);

bot.use(conversations());

bot.hears("Стоп", async (ctx) => {
    await ctx.conversation.exitAll();
    await ctx.reply("Створення поїздки скасовано");
})

export const calendar = new Calendar(bot, {
    date_format: "DD.MM.YYYY HH:mm",
    language: "uk",
    bot_api: "grammy",
    time_selector_mod: true,
    time_step: "30m",
    start_date: "now",
    start_week_day: 1,
});

bot.use(createConversation(createTrip, "createTrip"));

bot.command("start", (ctx) => start(ctx));
bot.hears('🔍 Знати поїздки', (ctx) => search(ctx));
bot.hears('🚗 Мої поїздки', (ctx) => myTrips(ctx));
bot.hears('Створити гру ➕', (ctx) => ctx.conversation.enter("createTrip"));
bot.callbackQuery(/^join_to_(.+)$/, joinToTrip);
bot.callbackQuery(/^leave_from_(.+)$/, leaveFromTrip)
bot.start();