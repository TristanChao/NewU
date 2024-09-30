-- Use SQL insert statements to add any
-- starting/dummy data to your database tables

-- EXAMPLE:

insert into "users" ("username", "hashedPassword", "displayName")
values
  ('demo',
  '$argon2id$v=19$m=65536,t=3,p=4$6ApRRXDxBqDASYMMfNswnw$82912ccYCdu9boY0Skf3FMYeJhoTzM+FZBpfOhCb94M',
  'Demo');

insert into "calendars" ("ownerId", "type", "name", "color", "desc", "goal")
values (1, 'normal', 'eat veggies', 'green', 'if you wanna be healthy, you gotta eat your veggies', 5);

insert into "calendarAccess" ("calendarId", "userId", "accessType")
values (1, 1, 'owner');
