import { createClient, SupabaseClient } from "@supabase/supabase-js";

let client: SupabaseClient | null = null;

export function supabase(): SupabaseClient {
  if (client) return client;

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY!;

  if (!url) throw new Error("Missing Supabase URL.");
  if (!key) throw new Error("Missing Supabase secret key.");

  client = createClient(url, key);
  return client;
}
