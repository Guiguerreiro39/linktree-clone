import { env } from "@/env";
import { createBrowserClient } from "@supabase/ssr";

const createClient = () =>
  createBrowserClient(
    env.NEXT_PUBLIC_SUPABASE_URL,
    env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  );

export const supabase = createClient();
