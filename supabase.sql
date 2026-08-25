-- Woordentrainer — à coller dans Supabase, onglet « SQL Editor », puis « Run ».
-- Ce script est ré-exécutable sans risque : il crée ce qui manque et ne
-- touche pas à ce qui existe déjà. À relancer après chaque mise à jour de
-- l'app qui ajoute une colonne.

create table if not exists duo (
  id      text primary key,
  liste   text,
  acquis  integer default 0,
  points  integer default 0,
  serie   integer default 0,
  maj     timestamptz default now(),
  etat    jsonb
);

-- meilleure série de bonnes réponses d'affilée sur la liste en cours.
-- Colonne ajoutée après la première version : cette ligne la rattrape sur
-- une table déjà créée.
alter table duo add column if not exists serie integer default 0;

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
