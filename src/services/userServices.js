import { supabase } from "../config/supabase.js";

async function getUserByTelegramId(id) {
    const { data, error } = await supabase
        .from('users')
        .select('id')
        .eq('id', id)
        .maybeSingle();

    if (error) throw new Error(error.message || JSON.stringify(error));
    return data;
}

async function createUser(newUser) {
    const { data, error } = await supabase
        .from('users')
        .insert([newUser])
        .select()
        .single();

    if (error) throw new Error(error.message || JSON.stringify(error));
    return data;
}

export async function findOrCreateUser(userData) {
    let user = await getUserByTelegramId(userData.id);

    if (!user) {
        const newUserPayload = {
            id: userData.id,
            first_name: userData.first_name,
            last_name: userData.last_name || null,
            username: userData.username || null
        };

        await createUser(newUserPayload);
        return true;
    }

    return false;
}