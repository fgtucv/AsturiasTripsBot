import { Bot } from "grammy";
import { config } from "./config/env.js";

import { start } from "./handlers/start.js";

const bot = new Bot(config.botToken);

bot.command("start", (ctx) => start(ctx));

bot.start();