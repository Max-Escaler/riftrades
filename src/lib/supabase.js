import { createClient } from '@supabase/supabase-js';

// RiftTrades Supabase project. The publishable (anon) key is safe to expose in
// the browser: all card/price tables are protected by public read-only RLS
// policies. Values can be overridden via Vite env vars for other environments.
const SUPABASE_URL =
    import.meta.env?.VITE_SUPABASE_URL || 'https://tenrvaghaspwdvnwvgrh.supabase.co';

const SUPABASE_ANON_KEY =
    import.meta.env?.VITE_SUPABASE_ANON_KEY ||
    'sb_publishable_ohMvMDesyA2rr4Y4nfALpg_i0N-swkr';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    auth: {
        persistSession: false,
        autoRefreshToken: false
    }
});
