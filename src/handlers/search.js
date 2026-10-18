import { getTrips } from "../services/searchServices.js";
import { getJoinKeyboard } from "../keyboards/getJoinKeyboard.js";

function formatTripMessage(trip) {
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
};

export async function search(ctx) {
    try {
        const trips = await getTrips();

        await ctx.reply(trips.length > 0 ? `Знайдено ${trips.length} поїздки 👇:` : "Немає доступних поїздок");
        for (const trip of trips) {
            await ctx.reply(formatTripMessage(trip), { reply_markup: getJoinKeyboard(trip.id), parse_mode: 'Markdown', disable_web_page_preview: true });
        };
    } catch (error) {
        await ctx.reply("Невдалось знйти поїздки збій в роботі бота");
        console.error(error);
    }
};