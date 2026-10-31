import { findOrCreateUser } from "../services/userServices.js";
import { getFullKeyboard } from "../keyboards/getBasicKeyboards.js";

export async function start(ctx) {
    try {
        const user = ctx.update.message.from;

        const isRegister = await findOrCreateUser(user);

        if (isRegister) {
            await ctx.reply(`Ласкаво просимо, ${user.first_name}! Ваш акаунт створено.`);
        } else {
            await ctx.reply(`З поверненням, ${user.first_name}!`);
        }
        
        await ctx.reply("Оберіть дію:", { reply_markup: getFullKeyboard(user.id) });
    } catch (error) {
        console.error("Помилка під час виконання команди start:", error.message || error);
        await ctx.reply("Сталася помилка при обробці запиту.");
    }
}