import { supabase } from "../config/supabase.js";

export async function getTrips() {
    const { data, error} = await supabase.from('trips').select('*');

    if (error) throw new Error(error.message);
    return data;
}