-- Share links: the owner of a diagnosis can publish a read-only summary at
-- /s/<share_id> (plus share images at /og/share/<share_id>). The public page
-- is served with the service role and only ever shows a safe projection of
-- the model output: never photos, the homeowner's words, or who owns it.
--
-- share_id is 16 random bytes, base64url (22 chars). Null means not shared;
-- "Stop sharing" sets both columns back to null, so the old link dies and
-- sharing again mints a new one.

alter table public.diagnoses
  add column share_id text,
  add column shared_at timestamptz,
  add constraint diagnoses_share_fields_together check ((share_id is null) = (shared_at is null));

-- Unique, and only indexed where set: most diagnoses are never shared, so the
-- index stays small. It also serves the public lookup by share id.
create unique index diagnoses_share_id_key on public.diagnoses (share_id)
  where share_id is not null;
