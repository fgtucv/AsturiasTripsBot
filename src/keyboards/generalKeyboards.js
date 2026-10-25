import { Keyboard } from "grammy";

export const generalKeyboards = () => {
    return new Keyboard().text("🔍 Знати поїздки").text("🚗 Мої поїздки").resized();
}