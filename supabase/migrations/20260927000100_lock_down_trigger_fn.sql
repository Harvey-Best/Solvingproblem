-- handle_new_user is only meant to run from the auth.users trigger; don't expose
-- it as an RPC endpoint (flagged by the Supabase security advisor).
revoke execute on function public.handle_new_user() from public, anon, authenticated;
