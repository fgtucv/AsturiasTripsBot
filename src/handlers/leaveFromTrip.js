import { getLeaveServices, deletParticipantService } from "../services/leaveService.js";

function changeParticipants(userId, participants) {
    const indexToDeleted = participants.findIndex((p) => p.id === userId);
    const removed = participants.splice(indexToDeleted, 1)
    
    return participants;
}

export async function leaveFromTrip(ctx) {
    const tripId = ctx.match[1];
    const userId = ctx.update.callback_query.from.id;

    try {
        const result = await getLeaveServices(tripId, userId);
        const deletParticipant = await deletParticipantService(changeParticipants(userId, result), tripId);

        if(!deletParticipant) ctx.reply("Ви відмовилтся від поїздки");
    } catch (error) {
        await ctx.reply(`Помилка: ${error}, не вдалось покинути поїздку`)
    }



    await ctx.answerCallbackQuery();
}