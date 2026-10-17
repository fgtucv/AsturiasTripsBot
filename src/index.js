import { Bot } from "grammy";
import { config } from "./config/env.js";

const bot = new Bot(config.botToken);

bot.command("start", (ctx) => ctx.reply("Бот працює"));

bot.start();