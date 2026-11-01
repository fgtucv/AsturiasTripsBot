import { leaveTrip } from "../services/participantsService.js";

export async function leaveFromTrip(ctx) {
    const tripId = ctx.match[1];
    const userId = ctx.update.callback_query.from.id;

    // console.log("leaveFromTrip tripId:", ctx.match);
    // console.log("leaveFromTrip userId:", userId);

    try {
        const isLeaved = await leaveTrip(tripId, userId);

        if(isLeaved) await ctx.reply("Ви відмовилтся від поїздки");
        if(!isLeaved) await ctx.reply("Ви не були учасником цієї поїздки");
    } catch (error) {
        await ctx.reply(`Помилка: ${error}, не вдалось покинути поїздку`)
    }

    await ctx.answerCallbackQuery();
}