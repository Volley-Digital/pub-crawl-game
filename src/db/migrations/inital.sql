-- 1) Games
create table if not exists games (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  start_time timestamptz not null,
  end_time timestamptz not null,
  final_unlock_time timestamptz not null,
  created_at timestamptz not null default now()
);

-- 2) Teams
create table if not exists teams (
  id uuid primary key default gen_random_uuid(),
  game_id uuid not null references games(id) on delete cascade,
  name text not null, -- 'A' or 'B'
  join_code text not null, -- shared code to join the game
  created_at timestamptz not null default now(),
  unique (game_id, name)
);

-- 4) Riddles
create table if not exists riddles (
  id uuid primary key default gen_random_uuid(),
  game_id uuid not null references games(id) on delete cascade,
  animal text not null,
  tier text not null check (tier in ('easy','med','hard')),
  is_final boolean not null default false,
  question text not null,
  accepted_answers text[] not null,
  points_solve int not null default 2,
  points_photo int not null default 1,
  points_challenge int not null default 1,
  pub_name text not null,
  maps_query text not null,
  challenge_text text not null,
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

-- 5) Submissions (one row per team per riddle attempt)
create table if not exists submissions (
  id uuid primary key default gen_random_uuid(),
  game_id uuid not null references games(id) on delete cascade,
  team_id uuid not null references teams(id) on delete cascade,
  riddle_id uuid not null references riddles(id) on delete cascade,
  status text not null default 'revealed' check (status in ('revealed','proved')),
  answered_correct boolean not null default false,
  used_skip boolean not null default false,
  went_to_location boolean not null default false,
  photo_url text null,
  created_at timestamptz not null default now(),
  unique (team_id, riddle_id)
);