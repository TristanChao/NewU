import { User } from '../components/UserContext';

const authKey = 'um.auth';

type Auth = {
  user: User;
  token: string;
};

const monthDaysArray = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

function addLeadingZero(num: number): string {
  if (num >= 10) return num.toString();
  return '0' + num.toString();
}

/**
 * Converts a Date object to a string.
 * @param date A Date object.
 * @returns A string of the date in the format 'yyyy-mm-dd'.
 */
export function dateToString(date?: Date): string {
  if (!date) date = new Date();

  const year = date.getFullYear().toString();
  const month = addLeadingZero(date.getMonth() + 1);
  const dateStr = addLeadingZero(date.getDate());
  return `${year}-${month}-${dateStr}`;
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

  const startStr = getStartStr(currentDate);
  const endStr = getEndStr(currentDate);

  return [startStr, endStr];
}

function getStartStr(date: Date) {
  let startYear = date.getFullYear();
  let startMonth = date.getMonth() + 1;
  let startDate = date.getDate() - date.getDay();
  if (startDate < 1) {
    startMonth--;
    startDate = monthDaysArray[startMonth - 1] + startDate;
    if (startMonth === 2) {
      if (checkLeapYear(startYear)) startDate++;
    } else if (startMonth < 1) {
      startYear--;
      startMonth = 12;
    }
  }
  const startStr =
    startYear +
    '-' +
    addLeadingZero(startMonth) +
    '-' +
    addLeadingZero(startDate);
  return startStr;
}

function getEndStr(date: Date) {
  let endYear = date.getFullYear();
  let endMonth = date.getMonth() + 1;
  let endDate = date.getDate() + (6 - date.getDay());
  if (endDate > monthDaysArray[endMonth - 1]) {
    endDate = endDate - monthDaysArray[endMonth - 1];
    if (endMonth === 2) {
      if (checkLeapYear(endYear)) endDate--;
    }
    endMonth++;
    if (endMonth > 12) {
      endYear++;
      endMonth = 1;
    }
  }
  const endStr =
    endYear + '-' + addLeadingZero(endMonth) + '-' + addLeadingZero(endDate);
  return endStr;
}

function checkLeapYear(year: number): boolean {
  // all years not divisible by 4 are false
  if (year % 4 !== 0) return false;
  // of years divisible by 4, any that are not divisible by 100 are true
  if (year % 100 !== 0) return true;
  // of years divisible by 100, any divisible by 400 are true
  if (year % 400 === 0) return true;
  // all others are false
  return false;
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

export type Calendar = {
  calendarId: number;
  name: string;
  desc: string;
  color: string;
  goal: number;
};
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

export type Mark = {
  calendarId: number;
  ownerId: number;
  date: string;
  isCompleted: boolean;
};
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

// export type UnsavedTodo = {
//   task: string;
//   isCompleted: boolean;
// };
// export type Todo = UnsavedTodo & {
//   todoId: number;
// };

// export async function readTodos(): Promise<Todo[]> {
//   const res = await fetch('/api/todos', {
//     headers: { Authorization: ('Bearer ' + readToken()) as string },
//   });
//   if (!res.ok) throw new Error(`fetch Error ${res.status}`);
//   return (await res.json()) as Todo[];
// }

// export async function insertTodo(todo: UnsavedTodo): Promise<Todo> {
//   const req = {
//     method: 'POST',
//     headers: {
//       'Content-Type': 'application/json',
//       Authorization: ('Bearer ' + readToken()) as string,
//     },
//     body: JSON.stringify(todo),
//   };
//   const res = await fetch('/api/todos', req);
//   if (!res.ok) throw new Error(`fetch Error ${res.status}`);
//   return (await res.json()) as Todo;
// }

// export async function updateTodo(todo: Todo): Promise<Todo> {
//   const req = {
//     method: 'PUT',
//     headers: {
//       'Content-Type': 'application/json',
//       Authorization: ('Bearer ' + readToken()) as string,
//     },
//     body: JSON.stringify(todo),
//   };
//   const res = await fetch(`/api/todos/${todo.todoId}`, req);
//   if (!res.ok) throw new Error(`fetch Error ${res.status}`);
//   return (await res.json()) as Todo;
// }

// export async function removeTodo(todoId: number): Promise<void> {
//   const req = {
//     method: 'DELETE',
//     headers: {
//       Authorization: ('Bearer ' + readToken()) as string,
//     },
//   };
//   const res = await fetch(`/api/todos/${todoId}`, req);
//   if (!res.ok) throw new Error(`fetch Error ${res.status}`);
// }
