set client_min_messages to warning;

-- DANGER: this is NOT how to do it in the real world.
-- `drop schema` INSTANTLY ERASES EVERYTHING.
drop schema "public" cascade;

create schema "public";

CREATE TABLE "users" (
  "userId"          serial          PRIMARY KEY,
  "username"        text            not null,
  "hashedPassword"  text            not null,
  "displayName"     text            not null,
  "createdAt"       timestamptz(6)  not null default now(),
  unique("username")
);

CREATE TABLE "calendars" (
  "calendarId"  serial          PRIMARY KEY,
  "ownerId"     integer         not null,
  "type"        text            not null,
  "name"        text            not null,
  "color"       text            not null,
  "desc"        text            not null,
  "goal"        integer          not null,
  "createdAt"   timestamptz(6)  not null default now()
);

CREATE TABLE "calendarAccess" (
  "calendarId"  integer         not null,
  "userId"      integer         not null,
  "createdAt"   timestamptz(6)  not null default now()
);

CREATE TABLE "habitMarks" (
  "markId"      serial          PRIMARY KEY,
  "calendarId"  integer         not null,
  "ownerId"     integer         not null,
  "date"        text            not null,
  "isCompleted" boolean         not null,
  "createdAt"   timestamptz(6)  not null default now()
);

ALTER TABLE "calendars" ADD FOREIGN KEY ("ownerId") REFERENCES "users" ("userId");

ALTER TABLE "calendarAccess" ADD FOREIGN KEY ("calendarId") REFERENCES "calendars" ("calendarId");

ALTER TABLE "calendarAccess" ADD FOREIGN KEY ("userId") REFERENCES "users" ("userId");

ALTER TABLE "habitMarks" ADD FOREIGN KEY ("calendarId") REFERENCES "calendars" ("calendarId");

ALTER TABLE "habitMarks" ADD FOREIGN KEY ("ownerId") REFERENCES "users" ("userId");
