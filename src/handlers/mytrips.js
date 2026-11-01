import { getUserTrips } from "../services/participantsService.js";
import { getLeaveKeyboard } from "../keyboards/getLeaveKeyboard.js";

function madeTripMasseg(trip) {
    const startDate = new Date(trip.started_at).toLocaleString('uk-UA', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    })

    return (`
*${trip.title}*

${trip.description || ''}

📅 *Дата та час:* ${startDate}
📍 *Локація:* [${trip.destination_name}](${trip.destination_url})
🚀 *Місце збору:* [${trip.start_point_name}](${trip.start_point_url})
📊 *Складність:* ${trip.difficulty_level}/5
💰 *Вартість:* ${trip.price} €
🚌 *Трансфер:* ${trip.transfer ? 'Є' : 'Немає'}
👥 *Макс. учасників:* ${trip.max_participants}
        `)
}

export async function myTrips(ctx) {
    const userId = ctx.update.message.from.id;

    try {
        const userTrips = await getUserTrips(userId);

        if (userTrips.length === 0) {
            await ctx.reply("У вас немає поїздок.");
            return;
        }

        for (const trip of userTrips) {
            const message = madeTripMasseg(trip);
            await ctx.reply(message, { reply_markup: getLeaveKeyboard(trip.id) });
        }

    } catch (error) {
        await ctx.reply(`Помилка: ${error.message}`)
    }
}