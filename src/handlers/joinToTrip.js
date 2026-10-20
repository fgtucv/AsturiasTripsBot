import { joinToTripService } from "../services/joinServices.js";

export async function joinToTrip(ctx) {
    try {
        const tripId = ctx.match[1];
        const userId = ctx.update.callback_query.from.id;
        const result = await joinToTripService(tripId, userId);

        if (!result.success) {
            await ctx.reply(`Помилка, невдалось приєднатися до поїздки: ${result?.error}`);
        } else if (!result.joined) {
            await ctx.reply("Ви вже приєднані до цієї поіздки");
        } else if (result.joined) {
            await ctx.reply("Ви успішно доєднались");
        }
    } catch (error) {
        await ctx.reply(`Помилка: ${error.message}`);
    }

    await ctx.answerCallbackQuery();
};