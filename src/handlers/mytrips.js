import { getTripsParticipants, getTripsByIds } from "../services/getTripsParticipants.js";
import { getLeaveKeyboard } from "../keyboards/getLeaveKeyboard.js";

function madeUserTripsArray(trips, userId) {
    const userTripsArray = [];

    for (const trip of trips) {
        const isUserTrip = trip.participants.some((p) => p.id === userId);

        if (isUserTrip) {
            userTripsArray.push(trip.trip_id);
        }
    }

    return userTripsArray;
}

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
        const { data, error } = await getTripsParticipants();

        if (error) throw new Error(error.message);
        if (!data) {
            await ctx.reply("Помилка в роботі бота дані не прийшли.")
            return;
        };

        const userTripsId = madeUserTripsArray(data, userId);

        if (userTripsId.length === 0) {
            await ctx.reply("Ви ще недоїдналися до поїздок")
        }

        try {
            const { trips } = await getTripsByIds(userTripsId);
            for (const trip of trips) {
                await ctx.reply(madeTripMasseg(trip), { reply_markup: getLeaveKeyboard(trip.id), parse_mode: 'Markdown', disable_web_page_preview: true });
            }
        } catch (error) {
            await ctx.reply(`Помилка: ${error.message}`)
        }

    } catch (error) {
        await ctx.reply(`Помилка: ${error.message}`)
    }
}