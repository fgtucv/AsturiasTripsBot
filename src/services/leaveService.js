import { supabase } from "../config/supabase.js";

export async function deletParticipantService(newParticipants, tripId) {
    const { error } = await supabase
        .from('trip_participants')
        .update({ participants: newParticipants })
        .eq('trip_id', tripId);


    if (error) throw new Error(error.message);

    return error;
}

export async function getLeaveServices(tripId) {
    const { data, error } = await supabase
        .from('trip_participants')
        .select('participants').eq('trip_id', tripId);

    if (error) throw new Error(error.message);

    const { participants } = data[0];

    return (participants)
}