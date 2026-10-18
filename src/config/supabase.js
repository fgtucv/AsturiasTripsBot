import { createClient } from "@supabase/supabase-js";
import { config } from "./env.js";

const api = config.api;
const key = config.apiSecretKey;

export const supabase = createClient(api, key);