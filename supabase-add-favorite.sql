-- Jalankan ini di Supabase SQL Editor untuk fitur Favorit
alter table media_entries add column if not exists favorite boolean default false;
