-- Create the game
insert into games (name, start_time, end_time, final_unlock_time)
values (
  'Prague Zoo Crawl',
  '2026-01-09 13:30:00+00',
  '2026-01-09 15:30:00+00',
  '2026-01-09 15:00:00+00'
);

-- Create Team A + Team B with the same join code
insert into teams (game_id, name, join_code)
select id, 'A', 'PRAUGEZOO2026' from games order by created_at desc limit 1;

insert into teams (game_id, name, join_code)
select id, 'B', 'PRAUGEZOO2026' from games order by created_at desc limit 1;