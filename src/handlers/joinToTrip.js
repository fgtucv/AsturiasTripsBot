import { joinTrip } from "../services/participantsService.js";

export async function joinToTrip(ctx) {
    const tripId = ctx.match[1];
    const userId = ctx.update.callback_query.from.id;

    try {
        const isJoined = await joinTrip(tripId, userId);

        if (!isJoined) {
            await ctx.reply("Ви вже приєднані до цієї поїздки");
        } else if (isJoined) {
            await ctx.reply("Ви успішно приєднались до поїздки");
        }
    } catch (error) {
        console.error(error);
        await ctx.reply(`Помилка, не вдалося приєднатися до поїздки.`);
    }

    await ctx.answerCallbackQuery();
};