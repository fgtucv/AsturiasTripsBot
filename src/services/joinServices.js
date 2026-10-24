import { supabase } from "../config/supabase.js";
import { getUserServic } from "./getUserServic.js";

async function getTripParticipants(tripId) {
    const { data, error } = await supabase
        .from('trip_participants').select('participants').eq('trip_id', tripId).single();

    if (error) throw new Error(error.message);
    return data;
}

async function replaceParticipants(newParticipants, tripId) {
    const { data, error } = await supabase
        .from('trip_participants').update({ participants: newParticipants }).eq('trip_id', tripId).select();

    if (error) throw new Error(error.message);
    return data;
}

export async function joinToTripService(tripId, userId) {
    try {
        const user = await getUserServic(userId);
        const { participants: currentParticipants } = await getTripParticipants(tripId);

        const isAlreadyJoined = currentParticipants.some(p => p.id === userId);
        if (isAlreadyJoined) {
            return { success: true, joined: false };
        }

        const newParticipants = [
            ...currentParticipants,
            {
                id: userId,
                first_name: user?.first_name || "",
                last_name: user?.last_name || "",
                username: user?.username || "",
                joined_at: new Date().toISOString()
            }
        ];

        await replaceParticipants(newParticipants, tripId);
        return { success: true, joined: true };
    } catch (error) {
        return { success: false, error: error.message }
    }
}