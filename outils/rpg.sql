-- Woordentrainer RPG (test) — à coller dans Supabase, onglet « SQL Editor », puis « Run ».
-- Crée la table du jeu, À CÔTÉ de celles de l'app : rien de ce qui existe n'est modifié.
-- Ré-exécutable sans risque.

create table if not exists rpg (
  id       text primary key,          -- 'ulysse' ou 'jasmien'
  semaine  text,                      -- dimanche de fin de la semaine (AAAA-MM-JJ)
  liste    text,                      -- liste choisie (semaine-01, ...)
  mots     integer default 0,         -- mots appris
  total    integer default 0,         -- taille du deck
  explo    integer default 0,         -- part du donjon explorée, en %
  dragon   boolean default false,     -- dragon vaincu
  enfui    boolean default false,     -- dragon enfui (semaine ratée)
  cadeaux  jsonb,                     -- ses trois idées de cadeau pour l'autre
  choisi   text,                      -- le cadeau qu'il ou elle a choisi au coffre
  maj      timestamptz default now()
);

alter table rpg enable row level security;
drop policy if exists rpg_lecture on rpg;
drop policy if exists rpg_insertion on rpg;
drop policy if exists rpg_maj on rpg;
create policy rpg_lecture   on rpg for select to anon using (true);
create policy rpg_insertion on rpg for insert to anon with check (true);
create policy rpg_maj       on rpg for update to anon using (true) with check (true);
grant usage on schema public to anon;
grant select, insert, update on table rpg to anon;

insert into rpg (id) values ('ulysse'), ('jasmien') on conflict (id) do nothing;
