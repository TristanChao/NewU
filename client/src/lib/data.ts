import { User } from '../components/UserContext';

const authKey = 'um.auth';

type Auth = {
  user: User;
  token: string;
};

export type Calendar = {
  calendarId: number;
  name: string;
  desc: string;
  color: string;
  goal: number;
};

export type Mark = {
  markId: number;
  calendarId: number;
  ownerId: number;
  date: string;
  day: number;
  isCompleted: boolean;
};

export type Access = {
  calendarId: number;
  userId: number;
  accessType: string;
};

export type Invite = {
  inviteId: number;
  calendarId: number;
  ownerId: number;
  shareeId: number;
};

export type CalendarShare = {
  inviteId: number;
  calendarId: number;
  ownerUsername: string;
  ownerDisplayName: string;
  calendarName: string;
  color: string;
};

/**
 * Converts a Date object to a string.
 * @param date A Date object.
 * @returns A string of the date in the format 'yyyy-mm-dd'.
 */
export function dateToString(date?: Date): string {
  if (!date) date = new Date();

  const year = date.getFullYear().toString();
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const dateStr = date.getDate().toString().padStart(2, '0');
  return `${year}-${month}-${dateStr}`;
}

export function prettifyDate(date: Date | string): string {
  const newDate = new Date(date);

  const newDateArr = newDate.toString().split(' ');
  return `${newDateArr[1]} ${newDateArr[2]}`;
}

/**
 * Given a date string or Date object, finds the first and last dates
 * (Sunday and Saturday) of that week
 * @param date A string in the format 'yyyy-mm-dd' or a Date object.
 * @returns An array of two date strings.
 */
export function findWeekStartEnd(date: string | Date): string[] {
  let currentDate: Date;
  if (typeof date === 'string') {
    currentDate = new Date(date);
  } else {
    currentDate = date;
  }

  const startDate = structuredClone(currentDate);
  startDate.setDate(startDate.getDate() - startDate.getDay());
  const startStr = dateToString(startDate);

  const endDate = structuredClone(currentDate);
  endDate.setDate(endDate.getDate() + (6 - endDate.getDay()));
  const endStr = dateToString(endDate);

  return [startStr, endStr];
}

/**
 * Takes a color name and converts it into a string of a CSS Tailwind Class
 * that will change the background to a hex color.
 * @param color A string of a color name.
 * @returns A string of a CSS Tailwind Class for background color.
 */
export function convertColorBg(color: string): string {
  switch (color) {
    case 'red':
      return ' bg-[#FF5A5A]';
    case 'orange':
      return ' bg-[#F29930]';
    case 'yellow':
      return ' bg-[#F2EA30]';
    case 'green':
      return ' bg-[#31F22D]';
    case 'blue':
      return ' bg-[#35E6F1]';
    case 'purple':
      return ' bg-[#D289FF]';
    case 'pink':
      return ' bg-[#FF7EFA]';
    default:
      return ' bg-[#808080]';
  }
}

/**
 * Takes a color name and converts it into a string of a CSS Tailwind Class
 * that will change the border to a hex color.
 * @param color A string of a color name.
 * @returns A string of a CSS Tailwind Class for border color.
 */
export function convertColorBorder(color: string): string {
  switch (color) {
    case 'red':
      return ' border-[#FF5A5A]';
    case 'orange':
      return ' border-[#F29930]';
    case 'yellow':
      return ' border-[#F2EA30]';
    case 'green':
      return ' border-[#31F22D]';
    case 'blue':
      return ' border-[#35E6F1]';
    case 'purple':
      return ' border-[#D289FF]';
    case 'pink':
      return ' border-[#FF7EFA]';
    default:
      return ' border-[#808080]';
  }
}

/**
 * Takes a color name and converts it into a string of a CSS Tailwind Class
 * that will change the background to a hex color of a lighter version of the
 * original color.
 * @param color A string of a color name.
 * @returns A string of a hex code for the given color.
 */
export function convertColorLightBg(color: string) {
  switch (color) {
    case 'red':
      return ' bg-[#FFE6E6]';
    case 'orange':
      return ' bg-[#FDF0E0]';
    case 'yellow':
      return ' bg-[#FDFCE0]';
    case 'green':
      return ' bg-[#DAFCD9]';
    case 'blue':
      return ' bg-[#D9FDFF]';
    case 'purple':
      return ' bg-[#F8EEFF]';
    case 'pink':
      return ' bg-[#FFECFE]';
  }
}

export function saveAuth(user: User, token: string): void {
  const auth: Auth = { user, token };
  localStorage.setItem(authKey, JSON.stringify(auth));
}

export function removeAuth(): void {
  localStorage.removeItem(authKey);
}

export function readUser(): User | undefined {
  const auth = localStorage.getItem(authKey);
  if (!auth) return undefined;
  return (JSON.parse(auth) as Auth).user;
}

export function readToken(): string | undefined {
  const auth = localStorage.getItem(authKey);
  if (!auth) return undefined;
  return (JSON.parse(auth) as Auth).token;
}

type SignUpParams = {
  username: string;
  password: string;
  displayName: string | undefined;
};
export async function signUp(params: SignUpParams): Promise<User> {
  const { username, password, displayName } = params;
  const req = {
    method: 'post',
    body: JSON.stringify({
      username,
      password,
      displayName: displayName ? displayName : username,
    }),
    headers: {
      'content-type': 'application/json',
    },
  };
  const res = await fetch('/api/auth/sign-up', req);
  if (!res.ok) throw new Error(`fetch Error: ${res.status}`);
  const newUser = (await res.json()) as User;
  return newUser;
}

type SignInParams = {
  username: string;
  password: string;
};
export async function signIn(params: SignInParams): Promise<Auth> {
  const { username, password } = params;
  const req = {
    method: 'post',
    body: JSON.stringify({
      username,
      password,
    }),
    headers: {
      'content-type': 'application/json',
    },
  };
  const res = await fetch('/api/auth/sign-in', req);
  if (!res.ok) throw new Error(`fetch Error: ${res.status}`);
  const user = (await res.json()) as Auth;
  return user;
}
export async function readCalendars(): Promise<Calendar[]> {
  const res = await fetch('/api/calendars', {
    headers: { Authorization: ('Bearer ' + readToken()) as string },
  });
  if (!res.ok) throw new Error(`fetch Error: ${res.status}`);
  const calendars = (await res.json()) as Calendar[];
  return calendars;
}

export async function readCalendar(calendarId: string): Promise<Calendar> {
  const res = await fetch(`/api/calendars/${calendarId}`, {
    headers: { Authorization: ('Bearer ' + readToken()) as string },
  });
  if (!res.ok) throw new Error(`fetch Error: ${res.status}`);
  const calendar = (await res.json()) as Calendar;
  return calendar;
}

type CreateCalParams = {
  type: string;
  name: string;
  color: string;
  desc?: string;
  goal: number;
};
export async function createCal({
  type,
  name,
  color,
  desc,
  goal,
}: CreateCalParams): Promise<Calendar> {
  const req = {
    body: JSON.stringify({
      type,
      name,
      color,
      desc,
      goal,
    }),
    headers: {
      'content-type': 'application/json',
      Authorization: ('Bearer ' + readToken()) as string,
    },
    method: 'post',
  };
  const res = await fetch('/api/calendar', req);
  if (!res.ok) throw new Error(`fetch Error: ${res.status}`);
  const calendar = (await res.json()) as Calendar;
  return calendar;
}

type UpdateCalParams = {
  calendarId: number;
  type: string;
  name: string;
  color: string;
  desc?: string;
  goal: number;
};
export async function updateCal({
  calendarId,
  type,
  name,
  color,
  desc,
  goal,
}: UpdateCalParams): Promise<Calendar> {
  const req = {
    body: JSON.stringify({
      calendarId,
      type,
      name,
      color,
      desc,
      goal,
    }),
    headers: {
      'content-type': 'application/json',
      Authorization: ('Bearer ' + readToken()) as string,
    },
    method: 'put',
  };
  const res = await fetch(`/api/calendar/${calendarId}`, req);
  if (!res.ok) throw new Error(`fetch Error: ${res.status}`);
  const calendar = (await res.json()) as Calendar;
  return calendar;
}

export async function deleteCal(calendarId: string): Promise<Calendar> {
  const req = {
    headers: {
      Authorization: ('Bearer ' + readToken()) as string,
    },
    method: 'delete',
  };
  const res = await fetch(`/api/calendar/${calendarId}`, req);
  if (!res.ok) throw new Error(`fetch Error: ${res.status}`);
  const deletedCal = (await res.json()) as Calendar;
  return deletedCal;
}

export async function readSharedCals(): Promise<(Calendar & Access)[]> {
  const req = {
    headers: {
      Authorization: ('Bearer ' + readToken()) as string,
    },
  };
  const res = await fetch('/api/shared/calendars', req);
  if (!res.ok) throw new Error(`fetch Error: ${res.status}`);
  const sharedCals = (await res.json()) as (Calendar & Access)[];
  return sharedCals;
}

// ------------------------------------------------------------------------

export async function readDateMarks(date: string): Promise<Mark[]> {
  const res = await fetch(`/api/marks/${date}`, {
    headers: { Authorization: ('Bearer ' + readToken()) as string },
  });
  if (!res.ok) throw new Error(`fetch Error: ${res.status}`);
  const marks = (await res.json()) as Mark[];
  return marks;
}

export async function readWeekMarks(date: string): Promise<Mark[]> {
  const [start, end] = findWeekStartEnd(date);
  const req = {
    body: JSON.stringify({ start, end }),
    headers: {
      'content-type': 'application/json',
      Authorization: ('Bearer ' + readToken()) as string,
    },
    method: 'post',
  };
  const res = await fetch('/api/marks/week', req);
  if (!res.ok) throw new Error(`fetch Error: ${res.status}`);
  const marks = (await res.json()) as Mark[];
  return marks;
}

export async function readWeekMarksCal(
  date: string,
  calendarId: number
): Promise<Mark[]> {
  const [start, end] = findWeekStartEnd(date);
  const req = {
    body: JSON.stringify({ start, end }),
    headers: {
      'content-type': 'application/json',
      Authorization: ('Bearer ' + readToken()) as string,
    },
    method: 'post',
  };
  const res = await fetch(`/api/marks/week/${calendarId}`, req);
  if (!res.ok) throw new Error(`fetch Error: ${res.status}`);
  const marks = (await res.json()) as Mark[];
  return marks;
}

type CreateMarkParams = {
  calendarId: number;
  date: string;
  isCompleted: boolean;
};
export async function createMark({
  calendarId,
  date,
  isCompleted,
}: CreateMarkParams): Promise<Mark> {
  const req = {
    body: JSON.stringify({
      calendarId,
      date,
      day: new Date(date + 'T00:00').getDay(),
      isCompleted,
    }),
    headers: {
      'content-type': 'application/json',
      Authorization: ('Bearer ' + readToken()) as string,
    },
    method: 'post',
  };
  const res = await fetch('/api/mark', req);
  if (!res.ok) throw new Error(`fetch Error: ${res.status}`);
  const newMark = (await res.json()) as Mark;
  return newMark;
}

type UpdateMarkParams = {
  markId: number;
  isCompleted: boolean;
};
export async function updateMark({
  markId,
  isCompleted,
}: UpdateMarkParams): Promise<Mark> {
  const req = {
    body: JSON.stringify({
      isCompleted,
    }),
    headers: {
      'content-type': 'application/json',
      Authorization: ('Bearer ' + readToken()) as string,
    },
    method: 'put',
  };
  const res = await fetch(`/api/mark/${markId}`, req);
  if (!res.ok) throw new Error(`fetch Error: ${res.status}`);
  const updatedMark = (await res.json()) as Mark;
  return updatedMark;
}

export async function readSharedWeekMarks(date: string): Promise<Mark[]> {
  const [start, end] = findWeekStartEnd(date);
  const req = {
    method: 'post',
    headers: {
      'content-type': 'application/json',
      Authorization: ('Bearer ' + readToken()) as string,
    },
    body: JSON.stringify({
      start,
      end,
    }),
  };
  const res = await fetch('/api/shared/marks', req);
  if (!res.ok) throw new Error(`fetch Error: ${res.status}`);
  const sharedMarks = (await res.json()) as Mark[];
  return sharedMarks;
}

// --------------------------------------------------------------------

type CreateAccessParams = {
  calendarId: number;
  accessType: string;
};
/**
 * Inserts a new row in the calendarAccess db table.
 * @param param An object containing calendarId, userId, and accessType
 * @returns The newly created access object.
 */
export async function createAccess({
  calendarId,
  accessType,
}: CreateAccessParams): Promise<Access> {
  const req = {
    body: JSON.stringify({ calendarId, accessType }),
    headers: {
      'content-type': 'application/json',
      Authorization: ('Bearer ' + readToken()) as string,
    },
    method: 'post',
  };
  const res = await fetch('/api/access', req);
  if (!res.ok) throw new Error(`fetch Error: ${res.status}`);
  const newAccess = (await res.json()) as Access;
  return newAccess;
}

export async function getUser(username: string): Promise<User> {
  const req = {
    headers: {
      Authorization: ('Bearer ' + readToken()) as string,
    },
  };
  const res = await fetch(`/api/user/${username}`, req);
  if (!res.ok) throw new Error(`fetch Error: ${res.status}`);
  const readUser = (await res.json()) as User;
  return readUser;
}

type CreateInviteParams = {
  calendarId: number;
  ownerId: number;
  shareeId: number;
};
export async function createInvite({
  calendarId,
  ownerId,
  shareeId,
}: CreateInviteParams): Promise<Invite> {
  const req = {
    method: 'post',
    headers: {
      'content-type': 'application/json',
      Authorization: ('Bearer ' + readToken()) as string,
    },
    body: JSON.stringify({
      calendarId,
      ownerId,
      shareeId,
    }),
  };
  const res = await fetch('/api/invite', req);
  if (!res.ok) throw new Error(`fetch Error: ${res.status}`);
  const newInvite = (await res.json()) as Invite;
  return newInvite;
}

export async function readInvites(): Promise<CalendarShare[]> {
  const req = {
    headers: {
      Authorization: ('Bearer ' + readToken()) as string,
    },
  };
  const res = await fetch('/api/invites', req);
  if (!res.ok) throw new Error(`fetch Error: ${res.status}`);
  const invites = (await res.json()) as CalendarShare[];
  return invites;
}

export async function deleteInvite(calendarId: number): Promise<Invite> {
  const req = {
    method: 'delete',
    headers: {
      'content-type': 'application/json',
      Authorization: ('Bearer ' + readToken()) as string,
    },
    body: JSON.stringify({ calendarId }),
  };
  const res = await fetch('/api/invite', req);
  if (!res.ok) throw new Error(`fetch Error: ${res.status}`);
  const deletedInvite = (await res.json()) as Invite;
  return deletedInvite;
}
