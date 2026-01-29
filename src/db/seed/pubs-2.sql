delete from riddles where game_id = '2ba8a48f-0791-41dc-a6a6-49dd34ff5e9c'::uuid;

insert into riddles (
  game_id,
  pub_name,
  english_name,
  animal,
  tier,
  icon,
  zone,
  is_final,
  question,
  accepted_answers,
  points_solve,
  points_photo,
  points_challenge,
  maps_query,
  challenge_text,
  sort_order,
  pub_image_url,
  open_hours
)
values
  ('2ba8a48f-0791-41dc-a6a6-49dd34ff5e9c'::uuid, 'Dva kohouti', 'The Two Roosters', 'Rooster', 'hard', '🐓', 1, false, 'In darkest hour before the light,
I split the silence of the night.
With proud and piercing call,
I summon dawn for one and all.', array['rooster','cockerel','cock'], 30, 0, 5, 'https://maps.app.goo.gl/8GBnhD6Zcwj7amGQ9', 'Stag in middle, arms flapping like wings, mouth wide mid-crow.
Group kneeling around him “waking up” shielding eyes.', 1, 'https://puwgtnynqdnztxqequrc.supabase.co/storage/v1/object/sign/Pub%20Images/Rooster.jpg?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV9hM2QyNmUwMS1jMDk0LTQyNjEtYjMwMi1jZTI1ZmZjZmQ5N2UiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJQdWIgSW1hZ2VzL1Jvb3N0ZXIuanBnIiwiaWF0IjoxNzY5NjQzOTc1LCJleHAiOjIwODUwMDM5NzV9.ZaKGlBUbHyCeYFNnQviAWJGM7hE8nGQOYmKCVHlm-Jc', '3 pm–1 am'),
  ('2ba8a48f-0791-41dc-a6a6-49dd34ff5e9c'::uuid, 'U Černého vola', 'The Black Ox', 'Ox', 'hard', '🐂', 2, false, 'With crescent blades upon my head,
Across the fields my path is led.
One vivid colour can spark my rage,
And stir a temper hard to cage.', array['ox','oxen','bull'], 30, 0, 5, 'https://maps.app.goo.gl/Hv1nTbrYD5bMhY9c7', 'Two teammates behind holding his belt like reins.
Stag leaning forward straining like he''s pulling a plough.
Everyone else pushing from behind.', 2, 'https://puwgtnynqdnztxqequrc.supabase.co/storage/v1/object/sign/Pub%20Images/Ox.jpg?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV9hM2QyNmUwMS1jMDk0LTQyNjEtYjMwMi1jZTI1ZmZjZmQ5N2UiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJQdWIgSW1hZ2VzL094LmpwZyIsImlhdCI6MTc2OTY0Mzk5NSwiZXhwIjoyMDg1MDAzOTk1fQ.qZ6eD8x3K1xQkXoK1xIh-Gt4mWQ1AbcZqfAHX8HkG8o', '10 am–10 pm'),
  ('2ba8a48f-0791-41dc-a6a6-49dd34ff5e9c'::uuid, 'U Hrocha', 'The Hippo', 'Hippo', 'med', '🦛', 2, false, 'Eyes on the water, body below,
A giant mouth where few should go.
A peaceful look you might mistake,
Until the water starts to wake.', array['hippo','hippopotamus'], 20, 0, 5, 'https://maps.app.goo.gl/KV7r8wGXnBsqYMu2A', 'Stag hiding lower face behind a pint. Only eyes visible.
Group crouched around like reeds watching him.', 3, 'https://puwgtnynqdnztxqequrc.supabase.co/storage/v1/object/sign/Pub%20Images/Hippo.jpg?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV9hM2QyNmUwMS1jMDk0LTQyNjEtYjMwMi1jZTI1ZmZjZmQ5N2UiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJQdWIgSW1hZ2VzL0hpcHBvLmpwZyIsImlhdCI6MTc2OTY0NDAwNywiZXhwIjoyMDg1MDA0MDA3fQ.A3y9vzznZpQ8R8q7uQ4CqL2sQn7S3Z0nqJX7eJXkQ2o', '12–11 pm'),
  ('2ba8a48f-0791-41dc-a6a6-49dd34ff5e9c'::uuid, 'U Kocoura', 'The Cat', 'Cat', 'med', '🐈', 2, false, 'With watchful eyes that glow at night,
I come and go just as I please,
And find myself in lofty trees.
What am I?', array['cat','housecat','house cat','feline'], 20, 0, 5, 'https://maps.app.goo.gl/1eVtz9aQGziSqpVcA', 'Stag mid-push knocking something off the table with dead eye contact.
Group gasping dramatically.', 4, 'https://puwgtnynqdnztxqequrc.supabase.co/storage/v1/object/sign/Pub%20Images/Cat.jpg?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV9hM2QyNmUwMS1jMDk0LTQyNjEtYjMwMi1jZTI1ZmZjZmQ5N2UiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJQdWIgSW1hZ2VzL0NhdC5qcGciLCJpYXQiOjE3Njk2NDQwMjAsImV4cCI6MjA4NTAwNDAyMH0.2m3o6bQO0t5o4nM9O2c7Kxv5mXkN4oE9GmYqgD1S4oE', '12–10:30 pm'),
  ('2ba8a48f-0791-41dc-a6a6-49dd34ff5e9c'::uuid, 'U Schnellů', 'The Snail', 'Snail', 'med', '🐌', 2, false, 'No legs, no wings, no hurried pace—
Yet I still journey place to place.
I leave a gleam where I have been,
Then hide away if I''m seen.
What am I?', array['snail','garden snail'], 20, 0, 5, 'https://maps.app.goo.gl/f8zFwFU2XqZ3YnoZ6', 'Stag on the floor stretched out reaching forward slowly.
Group pointing like a nature documentary.', 5, 'https://puwgtnynqdnztxqequrc.supabase.co/storage/v1/object/sign/Pub%20Images/Snail.jpg?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV9hM2QyNmUwMS1jMDk0LTQyNjEtYjMwMi1jZTI1ZmZjZmQ5N2UiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJQdWIgSW1hZ2VzL1NuYWlsLmpwZyIsImlhdCI6MTc2OTY0NDAzMywiZXhwIjoyMDg1MDA0MDMzfQ.9l9o4Xg3f8N9H3nq8c1VQw7QeU2xYxqz8HcO0kq4M0E', 'Not Specified'),
  ('2ba8a48f-0791-41dc-a6a6-49dd34ff5e9c'::uuid, 'U Vejvodů', 'The Pig', 'Pig', 'easy', '🐖', 2, false, 'I bathe in places others shun,
And dig for meals when day''s begun.
My rounded nose ploughs earth with care,
Through field and farm I wander there.
What am I?', array['pig','swine','hog','boar'], 10, 0, 5, 'https://maps.app.goo.gl/4f5dV7wT8S5Jp3vJ7', 'Stag bent over table “eating” snacks, hands behind back.
Group cheering him on like a farm animal.', 6, 'https://puwgtnynqdnztxqequrc.supabase.co/storage/v1/object/sign/Pub%20Images/Pig.jpg?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV9hM2QyNmUwMS1jMDk0LTQyNjEtYjMwMi1jZTI1ZmZjZmQ5N2UiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJQdWIgSW1hZ2VzL1BpZy5qcGciLCJpYXQiOjE3Njk2NDQwNDcsImV4cCI6MjA4NTAwNDA0N30.7mZpT9dN1y7nU8bQ3eGmY0cG1mG8oQ0bPz4kQk0l3cM', '11 am–11 pm'),
  ('2ba8a48f-0791-41dc-a6a6-49dd34ff5e9c'::uuid, 'U Červeného vlka', 'The Wolf', 'Wolf', 'easy', '🐺', 2, false, 'I raise my voice to greet the moon,
Across the dark my chorus croons.
I hunt with kin, not lone or free,
My tamer cousin lives with thee.
What am I?', array['wolf','grey wolf','gray wolf'], 10, 0, 5, 'https://maps.app.goo.gl/6u8uZf2nEw9YwQdE7', 'All heads tilted up howling at a ceiling light.
Arms around each other like a pack.', 7, 'https://puwgtnynqdnztxqequrc.supabase.co/storage/v1/object/sign/Pub%20Images/Wolf.jpg?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV9hM2QyNmUwMS1jMDk0LTQyNjEtYjMwMi1jZTI1ZmZjZmQ5N2UiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJQdWIgSW1hZ2VzL1dvbGYuanBnIiwiaWF0IjoxNzY5NjQ0MDYxLCJleHAiOjIwODUwMDQwNjF9.Nk0cJc0fQk9f3kYpQ2k8pJ1Vf7qGqT2VqKk3m0c9v0k', '4 pm–2 am'),
  ('2ba8a48f-0791-41dc-a6a6-49dd34ff5e9c'::uuid, 'U Brouka', 'The Beetle', 'Beetle', 'easy', '🪲', 2, false, 'I share my name with wheels and road,
Yet mine''s a far more ancient code.
Armoured back and six legs tread,
Through soil and leaf my path is led.
What am I?', array['beetle','bug','insect'], 10, 0, 5, 'https://maps.app.goo.gl/9Qd8w3bXy2pVt8dK8', 'Stag on his back, legs and arms in the air “trying to flip over”.
Group standing around debating if he''s dead.', 8, 'https://puwgtnynqdnztxqequrc.supabase.co/storage/v1/object/sign/Pub%20Images/Beetle.jpg?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV9hM2QyNmUwMS1jMDk0LTQyNjEtYjMwMi1jZTI1ZmZjZmQ5N2UiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJQdWIgSW1hZ2VzL0JlZXRsZS5qcGciLCJpYXQiOjE3Njk2NDQwNzUsImV4cCI6MjA4NTAwNDA3NX0.eC1dGq9Tt8S4mPq9c1H1yN0bZ6nY2jJk0x0qQ7p3w2k', '1 pm–12 am'),
  ('2ba8a48f-0791-41dc-a6a6-49dd34ff5e9c'::uuid, 'U Zlatého tygra', 'The Tiger', 'Tiger', 'med', '🐅', 2, false, 'In your home my distant kin may lie,
None know a fury like my eye.
If eyes should meet, you''re sure to flee,
My cousin''s king — yet some say me.
What am I?', array['tiger'], 20, 0, 5, 'https://maps.app.goo.gl/8qjJcYyQzY7kJp1g7', 'Stag crouched low stalking the camera.
Group behind pretending to hide in fear.', 9, 'https://puwgtnynqdnztxqequrc.supabase.co/storage/v1/object/sign/Pub%20Images/Tiger.jpg?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV9hM2QyNmUwMS1jMDk0LTQyNjEtYjMwMi1jZTI1ZmZjZmQ5N2UiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJQdWIgSW1hZ2VzL1RpZ2VyLmpwZyIsImlhdCI6MTc2OTY0NDA5MCwiZXhwIjoyMDg1MDA0MDkwfQ.p0k9cQ3b1mN8vP2qY0eGmQ7s9qK0nJ2yX1aB3cD5eF0', '3 pm–11 pm'),
  ('2ba8a48f-0791-41dc-a6a6-49dd34ff5e9c'::uuid, 'U Zlatého slona', 'The Elephant', 'Elephant', 'med', '🐘', 2, false, 'I have a face like a tree, where heavy wrinkles meet.
Though vast in size and thick of hide, the faintest scuttle chills my pride.
What am I?', array['elephant'], 20, 0, 5, 'https://maps.app.goo.gl/5o3pWz8uZg2mQk1p9', 'Stag using arm as trunk reaching toward camera.
Group pretending to feed him.', 10, 'https://puwgtnynqdnztxqequrc.supabase.co/storage/v1/object/sign/Pub%20Images/Elephant.jpg?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV9hM2QyNmUwMS1jMDk0LTQyNjEtYjMwMi1jZTI1ZmZjZmQ5N2UiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJQdWIgSW1hZ2VzL0VsZXBoYW50LmpwZyIsImlhdCI6MTc2OTY0NDEwNSwiZXhwIjoyMDg1MDA0MTA1fQ.1q2w3e4r5t6y7u8i9o0pQwErTyUiOpAsDfGhJkLzXc', '12 pm–12 am'),
  ('2ba8a48f-0791-41dc-a6a6-49dd34ff5e9c'::uuid, 'U Medvídků', 'The Bear', 'Bear', 'med', '🐻', 2, false, 'A mountain dressed in fur and claw,
I roam the woods by ancient law.
I trade the cold for months of sleep,
Then wake where rivers run and leap.
What am I?', array['bear','grizzly','brown bear'], 20, 0, 5, 'https://maps.app.goo.gl/J6j3Qq8mY2kP1vZt5', 'Stag curled up asleep on chair.
Group tiptoeing past dramatically.', 11, 'https://puwgtnynqdnztxqequrc.supabase.co/storage/v1/object/sign/Pub%20Images/Bear.jpg?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV9hM2QyNmUwMS1jMDk0LTQyNjEtYjMwMi1jZTI1ZmZjZmQ5N2UiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJQdWIgSW1hZ2VzL0JlYXIuanBnIiwiaWF0IjoxNzY5NjQ0MTIwLCJleHAiOjIwODUwMDQxMjB9.0k9j8h7g6f5d4s3a2p1oQwErTyUiOpAsDfGhJkLzXc', '11 am–12 am'),
  ('2ba8a48f-0791-41dc-a6a6-49dd34ff5e9c'::uuid, 'U Buldoka', 'The Bulldog', 'Bulldog', 'easy', '🐶', 2, false, 'From forest kin my line was drawn,
Yet by your fire I greet the dawn.
I wag my tail and guard your place,
With eager heart and friendly face.
What am I?', array['bulldog','dog','puppy'], 10, 0, 5, 'https://maps.app.goo.gl/r8vT2kQ7nY1pZ0mA6', 'Stag on all fours, tongue out, happy dog face.
Group gathered around petting his head like he''s the best boy in the world.', 12, 'https://puwgtnynqdnztxqequrc.supabase.co/storage/v1/object/sign/Pub%20Images/Bulldog.jpg?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV9hM2QyNmUwMS1jMDk0LTQyNjEtYjMwMi1jZTI1ZmZjZmQ5N2UiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJQdWIgSW1hZ2VzL0J1bGxkb2cuanBnIiwiaWF0IjoxNzY5NjQ0MTM1LCJleHAiOjIwODUwMDQxMzV9.ZxCvBnMmNnBbVvCcXxZzAaSsDdFfGgHhJjKkLl', '12 pm–12 am'),
  ('2ba8a48f-0791-41dc-a6a6-49dd34ff5e9c'::uuid, 'U Zelené žáby', 'The Frog', 'Frog', 'easy', '🐸', 2, false, 'I''m born with tail and lose it soon,
Then leap and croak beneath the moon.
What am I?', array['frog','toad'], 10, 0, 5, 'https://maps.app.goo.gl/y7Qp2mV8tK1zL0nB9', 'Stag mid frog-jump toward camera.
Group pointing and laughing.', 13, 'https://puwgtnynqdnztxqequrc.supabase.co/storage/v1/object/sign/Pub%20Images/Frog.jpg?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV9hM2QyNmUwMS1jMDk0LTQyNjEtYjMwMi1jZTI1ZmZjZmQ5N2UiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJQdWIgSW1hZ2VzL0Zyb2cuanBnIiwiaWF0IjoxNzY5NjQ0MTUwLCJleHAiOjIwODUwMDQxNTB9.KlMnOpQrStUvWxYz0123456789abcdefgHIJKL', '11 am–11 pm'),
  ('2ba8a48f-0791-41dc-a6a6-49dd34ff5e9c'::uuid, 'Červený Jelen', 'The Stag', 'Stag', 'hard', '🦌', 2, true, 'A branching crown upon my head,
Through forest paths my steps are led.
I call aloud in autumn''s air,
And share my name with why you''re here.
What am I?', array['stag','deer','red stag','jelen','hart'], 30, 0, 5, 'https://maps.app.goo.gl/3qZp7mV1kL8tQ0nX6', 'Everyone stands shoulder-to-shoulder with arms around each other, proper close huddle.
Stag in the middle. All smiling normally.', 14, 'https://puwgtnynqdnztxqequrc.supabase.co/storage/v1/object/sign/Pub%20Images/Stag.jpg?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV9hM2QyNmUwMS1jMDk0LTQyNjEtYjMwMi1jZTI1ZmZjZmQ5N2UiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJQdWIgSW1hZ2VzL1N0YWcuanBnIiwiaWF0IjoxNzY5NjQ0MTY1LCJleHAiOjIwODUwMDQxNjV9.QwErTyUiOpAsDfGhJkLzXcVbNmAsDfGhJkLzXcVbNm', '11 am–1 am'),
  ('2ba8a48f-0791-41dc-a6a6-49dd34ff5e9c'::uuid, 'U Veverky', 'The Squirrel', 'Squirrel', 'med', '🐿️', 2, false, 'With restless pace my days are led,
Where woven paths lie overhead.
I hide my riches out of sight,
Then lose their place by morning light.
What am I?', array['squirrel','red squirrel','grey squirrel','gray squirrel'], 20, 0, 5, 'https://maps.app.goo.gl/2pVt8dK8nY1mQ0zX7', 'Stag looking confused, checking pockets/table/floor.
Group pointing in different directions.', 15, 'https://puwgtnynqdnztxqequrc.supabase.co/storage/v1/object/sign/Pub%20Images/Squirrel.jpg?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV9hM2QyNmUwMS1jMDk0LTQyNjEtYjMwMi1jZTI1ZmZjZmQ5N2UiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJQdWIgSW1hZ2VzL1NxdWlycmVsLmpwZyIsImlhdCI6MTc2OTY0NDE4MCwiZXhwIjoyMDg1MDA0MTgwfQ.AsDfGhJkLzXcVbNmQwErTyUiOpAsDfGhJkLzXcVbNm', '12 pm–12 am'),
  ('2ba8a48f-0791-41dc-a6a6-49dd34ff5e9c'::uuid, 'U Tří jelínků', 'The Man', 'Man', 'easy', '👨', 2, false, 'No fur, no feathers, scales, or skin,
Yet I place every creature in.
With mind alone and hands set free,
The wild itself belongs to me.
What am I?', array['man','human','person'], 10, 0, 5, 'https://maps.app.goo.gl/1mQ0zX7pVt8dK8nY1', 'Everyone stands shoulder-to-shoulder with arms around each other, proper close huddle.
Stag in the middle. All smiling normally.', 16, 'https://puwgtnynqdnztxqequrc.supabase.co/storage/v1/object/sign/Pub%20Images/man.jpeg?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV9hM2QyNmUwMS1jMDk0LTQyNjEtYjMwMi1jZTI1ZmZjZmQ5N2UiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJQdWIgSW1hZ2VzL21hbi5qcGVnIiwiaWF0IjoxNzY5NjQ0MjI0LCJleHAiOjIwODUwMDQyMjR9.6qdQmHcSpdzqLjR_RIzRM-7U6sgUy7t9rpoP6wp9P0k', '11 am–11:30 pm');
