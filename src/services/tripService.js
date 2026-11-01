import { supabase } from "../config/supabase.js";

export async function getUpcomingTrips() {
    const { data: trips, error } = await supabase.from('trips').select('*')
        .gt('started_at', new Date().toISOString())
        .order('started_at');

    if (error) throw new Error(error.message);

    return trips;
}

export async function createTrip(newTrip) {
    const { data: trip, error: tripError } = await supabase
        .from('trips')
        .insert(newTrip)
        .select("*")
        .single();

    if (tripError) throw new Error(tripError.message);

    const { error: participantsError } = await supabase
        .from('trip_participants')
        .insert({ trip_id: trip.id, participants: [] });

    if (participantsError) throw new Error(participantsError.message);
}