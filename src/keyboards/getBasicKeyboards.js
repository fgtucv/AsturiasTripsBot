import { Keyboard } from "grammy";

const adminsIds = [1731256605];

function getAdminKeyboard() {
    return new Keyboard().text("Створити гру ➕");
};

function getGeneralKeyboards() {
    return new Keyboard().text("🔍 Знати поїздки").text("🚗 Мої поїздки").resized();
};

export function getFullKeyboard(userId) {
    if (adminsIds.includes(userId)) {
        return new Keyboard().append(getGeneralKeyboards()).append(getAdminKeyboard()).resized();
    } else {
        return getGeneralKeyboards();
    }
};