import { supabase } from "../config/supabase.js";

export async function getTripsByIds(idsArray) {
    const { data, error } = await supabase.from('trips').select("*").in('id', idsArray);
    return { trips: data };
}

export async function getTripsParticipants() {
    const { data, error } = await supabase.from('trip_participants').select('*');
    return { data: data, error: error };
}