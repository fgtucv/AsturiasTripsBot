import { findOrCreateUser } from "../services/userService.js";
import { getFullKeyboard } from "../keyboards/getBasicKeyboards.js";

export async function start(ctx) {
    try {
        const user = ctx.from;

        const isRegister = await findOrCreateUser(user);

        if (isRegister) {
            await ctx.reply(`Ласкаво просимо, ${user.first_name}! Ваш акаунт створено.`);
        } else if (!isRegister) {
            await ctx.reply(`З поверненням, ${user.first_name}!`);
        }
        
        await ctx.reply("Оберіть дію:", { reply_markup: getFullKeyboard(user.id) });
    } catch (error) {
        console.error("Помилка під час виконання команди start:", error.message || error);
        await ctx.reply("Помилки не вдалося авторизуватися.");
    }
}