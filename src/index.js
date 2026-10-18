import { Bot } from "grammy";
import { config } from "./config/env.js";

import { search } from "./handlers/search.js";
import { start } from "./handlers/start.js";
import { joinToTrip } from "./handlers/joinToTrip.js";

const bot = new Bot(config.botToken);

bot.command("start", (ctx) => start(ctx));
bot.hears('🔍 Знати поїздки', (ctx) => search(ctx));
bot.callbackQuery(/^join_to_(.+)$/, joinToTrip);
bot.start();