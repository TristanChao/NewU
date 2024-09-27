/* eslint-disable @typescript-eslint/no-unused-vars -- Remove when used */
import 'dotenv/config';
import express from 'express';
import pg from 'pg';
import argon2 from 'argon2';
import jwt from 'jsonwebtoken';
import { ClientError, errorMiddleware } from './lib/index.js';

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
    if (!result.rows[0])
      throw new ClientError(404, `user ${username} not found`);
    const { userId, hashedPassword, displayName } = result.rows[0];
    if (await argon2.verify(hashedPassword, password)) {
      const payload = { userId, username, displayName };
      const token = jwt.sign(payload, hashKey);
      res.json({ user: payload, token });
    } else {
      throw new ClientError(401, 'invalid login');
    }
  } catch (err) {
    next(err);
  }
});

// checks the database to see if the account with username 'demo' exists
app.get('/api/users/demo', async (req, res, next) => {
  try {
    const sql = `
      select "userId",
             "username"
      from "users"
      where "username" = 'demo';
    `;
    const result = await db.query(sql);
    const demoExists = !!result.rows[0];
    res.json({ demoExists });
  } catch (err) {
    next(err);
  }
});

app.get('/api/habits', async (req, res, next) => {
  try {
    const sql = `
      select *
      from "calendars"
      where "userId" = $1
      order by "userId";
    `;
    const result = await db.query(sql, [req.user?.userId]);
    res.json(result.rows);
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
