-- Woordentrainer — à coller dans Supabase, onglet « SQL Editor », puis « Run ».
-- Crée la table partagée, l'ouvre en lecture et écriture pour l'app,
-- et prépare les trois lignes utilisées : toi, Jasmien, et la liste de la semaine.

create table if not exists duo (
  id      text primary key,
  liste   text,
  acquis  integer default 0,
  points  integer default 0,
  maj     timestamptz default now(),
  etat    jsonb
);

alter table duo enable row level security;

drop policy if exists duo_lecture on duo;
drop policy if exists duo_insertion on duo;
drop policy if exists duo_maj on duo;

create policy duo_lecture   on duo for select to anon using (true);
create policy duo_insertion on duo for insert to anon with check (true);
create policy duo_maj       on duo for update to anon using (true) with check (true);

grant usage on schema public to anon;
grant select, insert, update on table duo to anon;

insert into duo (id) values ('ulysse'), ('jasmien'), ('semaine')
on conflict (id) do nothing;
