/* eslint-disable @typescript-eslint/no-unused-vars -- Remove when used */
import 'dotenv/config';
import express from 'express';
import pg from 'pg';
import argon2 from 'argon2';
import jwt from 'jsonwebtoken';
import { authMiddleware, ClientError, errorMiddleware } from './lib/index.js';

type Auth = {
  username: string;
  password: string;
};

const db = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

const hashKey = process.env.TOKEN_SECRET;
if (!hashKey) throw new Error('TOKEN_SECRET not found in .env');

const app = express();

// Create paths for static directories
const reactStaticDir = new URL('../client/dist', import.meta.url).pathname;
const uploadsStaticDir = new URL('public', import.meta.url).pathname;

app.use(express.static(reactStaticDir));
// Static directory for file uploads server/public/
app.use(express.static(uploadsStaticDir));
app.use(express.json());

app.get('/api/hello', (req, res) => {
  res.json({ message: 'Hello, World!' });
});

// creates a new user when the sign-up form is submitted
app.post('/api/auth/sign-up', async (req, res, next) => {
  try {
    const { username, password, displayName } = req.body;
    if (!username || !password || !displayName) {
      throw new ClientError(
        400,
        'username, password, and displayName are required fields'
      );
    }

    const hashedPassword = await argon2.hash(password);
    const sql = `
      insert into "users" ("username", "hashedPassword", "displayName")
      values ($1, $2, $3)
      returning "userId", "username", "displayName", "createdAt";
    `;
    const result = await db.query(sql, [username, hashedPassword, displayName]);
    const newUser = result.rows[0];
    if (!newUser) throw new ClientError(404, 'error creating user');
    res.json(newUser);
  } catch (err) {
    next(err);
  }
});

// when user signs in
// checks for existing username, verifies password, creates jwt token
app.post('/api/auth/sign-in', async (req, res, next) => {
  try {
    const { username, password } = req.body as Partial<Auth>;
    if (!username || !password) {
      throw new ClientError(401, 'invalid login');
    }

    const sql = `
      select "userId",
             "hashedPassword",
             "displayName"
      from "users"
      where "username" = $1;
    `;
    const result = await db.query(sql, [username]);
    if (!result.rows[0]) {
      throw new ClientError(404, `user ${username} not found`);
    }

    const { userId, hashedPassword, displayName } = result.rows[0];
    if (!(await argon2.verify(hashedPassword, password))) {
      throw new ClientError(401, 'invalid login');
    }

    const payload = { userId, username, displayName };
    const token = jwt.sign(payload, hashKey);
    res.json({ user: payload, token });
  } catch (err) {
    next(err);
  }
});

// gets a list of all calendars for the user currently signed in
app.get('/api/calendars', authMiddleware, async (req, res, next) => {
  try {
    const sql = `
      select *
      from "calendars"
      where "ownerId" = $1
      order by "calendarId";
    `;
    const result = await db.query(sql, [req.user?.userId]);
    res.json(result.rows);
  } catch (err) {
    next(err);
  }
});

app.get(
  '/api/calendars/:calendarId',
  authMiddleware,
  async (req, res, next) => {
    try {
      const { calendarId } = req.params;
      const sql = `
        select *
        from "calendars"
        where "calendarId" = $1
          and "ownerId" = $2
        order by "calendarId";
      `;
      const result = await db.query(sql, [calendarId, req.user?.userId]);
      const calendar = result.rows[0];
      if (!calendar) throw new ClientError(400, 'calendar not found');
      res.json(calendar);
    } catch (err) {
      next(err);
    }
  }
);

// gets a list of all the markers for a specified date belonging to the current user
app.get('/api/marks/:date', authMiddleware, async (req, res, next) => {
  try {
    const { date } = req.params;
    const sql = `
      select *
      from "habitMarks"
      where "date" = $1
        and "ownerId" = $2;
    `;
    const result = await db.query(sql, [date, req.user?.userId]);
    res.json(result.rows);
  } catch (err) {
    next(err);
  }
});

// gets a list of all the markers for a given week belonging to the current user
app.post('/api/marks/week', authMiddleware, async (req, res, next) => {
  try {
    const { start, end } = req.body;
    const sql = `
      select *
      from "habitMarks"
      where "date" >= $1 and "date" <= $2
        and "ownerId" = $3;
    `;
    const result = await db.query(sql, [start, end, req.user?.userId]);
    res.json(result.rows);
  } catch (err) {
    next(err);
  }
});

app.get(
  '/api/marks/week/:calendarId',
  authMiddleware,
  async (req, res, next) => {
    try {
      const { calendarId } = req.params;
      const { start, end } = req.body;
      const sql = `
      select *
      from "habitMarks"
      where "date" >= $1 and "date" <= $2
        and "calendarId" = $3
        and "ownerId" = $4;
    `;
      const params = [start, end, Number(calendarId), req.user?.userId];
      const result = await db.query(sql, params);
      res.json(result.rows);
    } catch (err) {
      next(err);
    }
  }
);

app.post('/api/calendar', authMiddleware, async (req, res, next) => {
  try {
    const { type, name, color, desc, goal } = req.body;
    const sql = `
      insert into "calendars" ("ownerId", "type", "name", "color", "desc", "goal")
      values ($1, $2, $3, $4, $5, $6)
      returning *;
    `;
    const params = [req.user?.userId, type, name, color, desc, goal];
    const result = await db.query(sql, params);
    const newCal = result.rows[0];
    if (!newCal) throw new ClientError(400, 'Error creating calendar');
    res.json(newCal);
  } catch (err) {
    next(err);
  }
});

app.post('/api/mark/', authMiddleware, async (req, res, next) => {
  try {
    const { calendarId, date, isCompleted } = req.body;
    const sql = `
      insert into "habitMarks" ("calendarId", "ownerId", "date", "isCompleted")
      values ($1, $2, $3, $4)
      returning *;
    `;
    const params = [calendarId, req.user?.userId, date, isCompleted];
    const result = await db.query(sql, params);
    const newMark = result.rows[0];
    if (!newMark) throw new ClientError(400, 'Error creating mark');
    res.json(newMark);
  } catch (err) {
    next(err);
  }
});

app.put('/api/mark/:markId', authMiddleware, async (req, res, next) => {
  try {
    const { markId } = req.params;
    const { isCompleted } = req.body;
    const sql = `
      update "habitMarks"
      set "isCompleted" = $1
      where "markId" = $2
        and "ownerId" = $3
      returning *;
    `;
    const params = [isCompleted, markId, req.user?.userId];
    const result = await db.query(sql, params);
    const updatedMark = result.rows[0];
    if (!updatedMark) {
      throw new ClientError(400, `Mark ${markId} does not exist`);
    }
    res.json(updatedMark);
  } catch (err) {
    next(err);
  }
});

/*
 * Handles paths that aren't handled by any other route handler.
 * It responds with `index.html` to support page refreshes with React Router.
 * This must be the _last_ route, just before errorMiddleware.
 */
app.get('*', (req, res) => res.sendFile(`${reactStaticDir}/index.html`));

app.use(errorMiddleware);

app.listen(process.env.PORT, () => {
  console.log('Listening on port', process.env.PORT);
});
