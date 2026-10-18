import { config } from "../config/env.js";
import { createClient } from "@supabase/supabase-js";

const API = config.api;
const API_SECRET_KEY = config.apiSecretKey;

const supabase = createClient(API, API_SECRET_KEY);

export async function start(ctx) {
    const { id, first_name, last_name, username } = ctx.update.message.from;

    let { data: user, error } = await supabase
        .from('users')
        .select('id')
        .eq('id', id)
        .maybeSingle();

    if (!user) {
        const { data: newUser, error } = await supabase
            .from('users')
            .insert([{ id: id, first_name: first_name, last_name: last_name, username: username }])
            .select()
            .single();

        user = newUser
        await ctx.reply(`Ласкаво просимо, ${first_name}. Ви усішно зареєстровані!`);
    } else (
        await ctx.reply(`З поверненям, ${first_name}`)
    )
}