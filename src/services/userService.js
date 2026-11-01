import { supabase } from "../config/supabase.js";

export async function findOrCreateUser(telegramUser) {
    const { data, error } = await supabase
        .from("users")
        .upsert({
            id: telegramUser.id,
            first_name: telegramUser.first_name,
            last_name: telegramUser.last_name,
            username: telegramUser.username,
        },
        { onConflict: 'id', ignoreDuplicates: true })
        .select();

    if (error) throw new Error(error.message);

    return data.length > 0; // true: щойно створено, false: уже був
}