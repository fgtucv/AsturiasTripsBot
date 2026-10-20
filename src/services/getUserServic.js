import { supabase } from "../config/supabase.js";

export async function getUserServic(id) {
    const {data, error} = await supabase
        .from('users').select('first_name, last_name, username').eq('id', id).maybeSingle();

    if (error) throw new Error(error.message);
    return data;
}