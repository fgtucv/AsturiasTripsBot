import { InlineKeyboard } from "grammy";

export function getLeaveKeyboard(tripId) {
    return new InlineKeyboard().text("Покинути ❌", `leave_from_${tripId}`)
}