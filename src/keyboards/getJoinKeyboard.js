import { InlineKeyboard } from "grammy";

export function getJoinKeyboard(tripId) {
    return new InlineKeyboard().text("Доєднатись 🚀", `join_to_${tripId}`);
}