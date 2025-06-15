
-- This allows Supabase Realtime to get detailed information on row changes.
ALTER TABLE public.user_stats REPLICA IDENTITY FULL;

-- This adds the user_stats table to the group of tables that broadcast realtime changes.
ALTER PUBLICATION supabase_realtime ADD TABLE public.user_stats;
