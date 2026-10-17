import "dotenv/config";


const envVars = ['BOT_TOKEN', 'API_SECRET_KEY'];

for (const envVar of envVars) {
    if (!process.env[envVar]) {
        throw new Error(`[ERROR] Відсутня обов'язкова змінна оточення: ${envVar} у файлі .env!`)
    }
};

export const config = {
    botToken: process.env.BOT_TOKEN,
    apiSecretKey: process.env.API_SECRET_KEY,
    tripsApi: process.env.TRIPS_API,
    participantsApi: process.env.PARTICIPANTS_API,
    usersApi: process.env.USERS_API
}