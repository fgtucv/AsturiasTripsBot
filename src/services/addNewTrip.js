import { supabase } from "../config/supabase.js";

export async function addTripToTripsParticipants(newTripId) {
    const { error } = await supabase
        .from('trip_participants')
        .insert({ trip_id: newTripId, participants: [] })
        .select()
        .single();

    if (error) throw new Error(error.message);
}

export async function addTripToTrips(newTrip) {
    const { error, data } = await supabase
        .from('trips')
        .insert(newTrip)
        .select()
        .single();

    addTripToTripsParticipants(data.id);

    if (error) throw new Error(error.message);
}