import { createClient, type SupabaseClient } from "@supabase/supabase-js";

import type { Database } from "../db/database.types.ts";

const supabaseUrl = import.meta.env.SUPABASE_URL;
const supabaseAnonKey = import.meta.env.SUPABASE_KEY;

export const supabaseClient = createClient<Database>(supabaseUrl, supabaseAnonKey);

export type { SupabaseClient };

export const DEFAULT_USER_ID = "712e5ba4-b381-4690-bd82-36c22d970dc2";
