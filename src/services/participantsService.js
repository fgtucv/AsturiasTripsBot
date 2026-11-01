import { supabase } from "../config/supabase.js";

export async function joinTrip(tripId, userId) {
    const { data, error } = await supabase.rpc('join_trip', {
        p_trip_id: tripId,
        p_user_id: userId,
    });

    if (error) throw new Error(error.message);
    return data;   // true: додано, false: вже був у поїздці
}

export async function leaveTrip(tripId, userId) {
    const { data, error } = await supabase.rpc('leave_trip', {
        p_trip_id: tripId,
        p_user_id: userId,
    });

    // console.log("leaveTrip data:", data);
    // console.log("leaveTrip error:", error);

    if (error) throw new Error(error.message);
    return data;   // true: видалено, false: його там і не було
}

export async function getUserTrips(userId) {
    const { data, error } = await supabase
        .from('trip_participants')
        .select('trips(*)')
        .contains('participants', [userId]);

    if (error) throw new Error(error.message);
    return data.map(row => row.trips);
}