-- ===========
-- seed_riddles.sql
-- ===========
-- Assumes there is a game row named 'Prague Zoo Crawl'
-- Change the game name below if needed.

with g as (
  select id as game_id
  from games
  where name = 'Prague Zoo Crawl'
  order by created_at desc
  limit 1
)
insert into riddles (
  game_id,
  animal,
  tier,
  is_final,
  question,
  accepted_answers,
  points_solve,
  points_photo,
  points_challenge,
  pub_name,
  maps_query,
  challenge_text,
  sort_order
)
select
  g.game_id,
  x.animal,
  x.tier,
  x.is_final,
  x.question,
  x.accepted_answers,
  x.points_solve,
  x.points_photo,
  x.points_challenge,
  x.pub_name,
  x.maps_query,
  x.challenge_text,
  x.sort_order
from g
cross join (
  values
  -- 1
  (
    'black ox / bull',
    'easy',
    false,
    'I''m built like a tank, stubborn as your mate after 6 pints, and I pull my weight. Not a cow. What am I?',
    array['bull','ox','black ox','vole','vol','vul','černý vůl','cerny vul','cerny vol'],
    2, 1, 1,
    'U Černého vola',
    'U Černého vola Prague',
    'Before ordering, the groom must snort like a bull and point at the sign like he discovered fire.',
    1
  ),

  -- 2
  (
    'hippo',
    'easy',
    false,
    'I look like I''m smiling, live near water, and I''m responsible for more chaos than I appear. What am I?',
    array['hippo','hippopotamus','hroch'],
    2, 1, 1,
    'U Hrocha',
    'U Hrocha Prague',
    'Groom must order the first drink using ONLY hippo noises + pointing. No real words.',
    2
  ),

  -- 3
  (
    'golden tiger',
    'med',
    false,
    'Striped suit. Predator energy. Would absolutely steal your kebab and your girl. What am I?',
    array['tiger','golden tiger','tygr','tygra','zlateny tygr','zlaty tygr','zlatého tygra'],
    3, 1, 1,
    'U Zlatého tygra',
    'U Zlatého tygra Prague',
    'Take a team photo doing your best “tiger pose”. Groom must bare teeth. Bonus cringe encouraged.',
    3
  ),

  -- 4
  (
    'two cats',
    'easy',
    false,
    'Not one… but DOUBLE trouble. Knocks things off tables as a coordinated unit. What am I?',
    array['cat','cats','two cats','kočka','kočky','kocka','kocky','dvě kočky','dve kocky','dvou koček','dvou kocek'],
    2, 1, 1,
    'U Dvou koček',
    'U Dvou koček Prague',
    'Everyone must do a “meow” toast. Groom has to purr for 5 seconds (painful).',
    4
  ),

  -- 5
  (
    'tomcat',
    'easy',
    false,
    'I act like I own the place, show up when I want, and I''m allergic to commitment. What am I?',
    array['cat','tomcat','male cat','kocour','kocoura'],
    2, 1, 1,
    'U Kocoura',
    'U Kocoura Prague',
    'Groom must do a smug “catwalk” from the door to the bar. No laughing = impossible.',
    5
  ),

  -- 6
  (
    'bear',
    'med',
    false,
    'Cuddly in cartoons. Terrifying in real life. Would win a fight with your entire group. What am I?',
    array['bear','bears','little bear','medvěd','medved','medvídek','medvidek','medvídci','medvidci'],
    3, 1, 1,
    'U Medvídků',
    'U Medvídků Prague',
    'Groom must do a “bear roar” outside, then pretend to hibernate (lie on a bench) for 10 seconds.',
    6
  ),

  -- 7
  (
    'elephant',
    'med',
    false,
    'I never forget… especially who owes the next round. Big, grey, and built like a tank. What am I?',
    array['elephant','slon','slona','golden elephant','zlaty slon','zlatého slona'],
    3, 1, 1,
    'U Zlatého slona',
    'U Zlatého slona Prague',
    'One teammate must name 3 groom “core memories”. If they can’t, groom drinks first.',
    7
  ),

  -- 8
  (
    'bulldog',
    'easy',
    false,
    'Short. Stocky. Stubborn. Breath like a night bus at 2am. What am I?',
    array['dog','bulldog','buldok','pes'],
    2, 1, 1,
    'U Buldoka',
    'U Buldoka Prague',
    'Groom must bark “WOOF WOOF” to summon the bartender (from a respectful distance).',
    8
  ),

  -- 9
  (
    'squirrel',
    'med',
    false,
    'Tiny, twitchy, and I hoard snacks like the best man hoards excuses. What am I?',
    array['squirrel','veverka','veverky'],
    3, 1, 1,
    'U Veverky',
    'U Veverky Prague',
    'Each team must “hide” a snack in someone’s pocket/bag and reveal it later as “winter supplies”.',
    9
  ),

  -- 10
  (
    'two roosters',
    'med',
    false,
    'I wake everyone up, I shout nonsense, and I''m convinced I''m the main character. What am I?',
    array['rooster','roosters','cockerel','kohout','kohouti','dva kohouti','two roosters'],
    3, 1, 1,
    'Dva Kohouti',
    'Dva Kohouti Prague',
    'Groom must do a rooster crow outside. If he refuses, team loses the challenge point.',
    10
  ),

  -- 11
  (
    'white lion',
    'med',
    false,
    'I''m the king. I don''t queue. I definitely think I can fight a bouncer. What am I?',
    array['lion','white lion','lev','bílý lev','bily lev','bilého lva','bileho lva','bílého lva'],
    3, 1, 1,
    'U Bílého Lva',
    'U Bílého Lva Prague',
    'Winning team member must give the groom a “knighting” ceremony with a plastic spoon as the sword.',
    11
  ),

  -- 12
  (
    'red lion',
    'med',
    false,
    'Not white. Not shy. King energy with a temper after two beers. What am I?',
    array['lion','red lion','lev','červený lev','cerveny lev','u červeného lva','u cerveneho lva'],
    3, 1, 1,
    'U Červeného Lva',
    'U Červeného Lva Prague',
    'Group must take a photo “protecting the pride”: arms around groom, mean faces, zero dignity.',
    12
  ),

  -- 13
  (
    'frog',
    'easy',
    false,
    'I''m small, green, and I jump from bad decisions to worse decisions. What am I?',
    array['frog','green frog','žába','zaba','zelená žába','zelena zaba'],
    2, 1, 1,
    'Brasileiro U Zelené žáby',
    'Brasileiro U Zelené žáby Prague',
    'Groom must hop 10 steps like a frog while the team chants “RIBBIT RIBBIT”.',
    13
  ),

  -- 14
  (
    'swan',
    'med',
    false,
    'Elegant, dramatic, and fully capable of starting a fight for no reason. What am I?',
    array['swan','labuť','labut','labutě','labute'],
    3, 1, 1,
    'U Labutě',
    'U Labutě Prague',
    'Groom must do a “graceful swan” pose in the proof photo. Think ballet, not bird.',
    14
  ),

  -- 15
  (
    'three ostriches',
    'hard',
    false,
    'Three of us. We run fast, we panic, and we hide our heads when reality arrives. What are we?',
    array['ostrich','ostriches','pštros','pstros','pštrosi','pstrosi','tři pštrosi','tri pstrosi','u tří pštrosů','u tri pstrosu'],
    5, 1, 1,
    'U Tří Pštrosů',
    'U Tří Pštrosů Prague',
    'Proof photo must include one teammate pretending to bury their head (hoodie over head works).',
    15
  ),

  -- 16
  (
    'three fawns',
    'hard',
    false,
    'We''re deer… but make it “cute and innocent”… which is exactly how the groom acts when you mention marriage. What are we?',
    array['fawn','fawns','young deer','jelínek','jelinek','jelínci','jelinci','u tří jelínků','u tri jelinku','tri jelinky','tři jelínci','tři jelínků'],
    5, 1, 1,
    'U Tří jelínků',
    'U Tří jelínků Prague',
    'Groom must do “baby deer legs” (wobbly knees) in the proof video/photo.',
    16
  ),

  -- 17
  (
    'sheep',
    'easy',
    false,
    'I follow the crowd, panic easily, and I’m 1 bad decision away from chaos. What am I?',
    array['sheep','black sheep'],
    2, 1, 1,
    'Black Sheep Prague',
    'Black Sheep Prague bar',
    'Team must take a photo doing their best “baa” face. Groom must be front and centre.',
    17
  ),

  -- 18
  (
    'monkey',
    'easy',
    false,
    'I climb, I steal, I make bad decisions look fun, and I’d 100% join your group chat. What am I?',
    array['monkey','ape'],
    2, 1, 1,
    'Monkey Bar Prague',
    'Monkey Bar Prague',
    'Groom must do a monkey impression for 5 seconds before the first sip.',
    18
  ),

  -- 19
  (
    'dog',
    'easy',
    false,
    'Loyal, noisy, always hungry, and somehow still lovable after causing chaos. What am I?',
    array['dog','black dog','hound'],
    2, 1, 1,
    'Black Dog Cantina',
    'Black Dog Cantina Prague',
    'Someone must give the groom a “good boy” head pat in the proof photo. Non-negotiable.',
    19
  ),

  -- 20 (FINAL)
  (
    'red stag / deer',
    'hard',
    true,
    'FINAL: Antlers. Pride. The literal mascot of this weekend. If you don’t know this, you shouldn’t be here. What am I?',
    array['stag','deer','red stag','jelen','červený jelen','cerveny jelen','cerveny jelen prague'],
    5, 2, 2,
    'Červený Jelen',
    'Červený Jelen Prague',
    'FINAL RULE: Everyone meets here. Losing team buys the first round. Groom must do one last animal noise to close the Zoo.',
    20
  )
) as x(
  animal, tier, is_final, question, accepted_answers,
  points_solve, points_photo, points_challenge,
  pub_name, maps_query, challenge_text, sort_order
);
