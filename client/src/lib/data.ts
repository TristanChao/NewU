import { User } from '../components/UserContext';

const authKey = 'um.auth';

type Auth = {
  user: User;
  token: string;
};

/**
 * Converts a Date object of today's date to a string.
 * @returns A string of the format 'yyyy-mm-dd'.
 */
export function todayToString() {
  const today = new Date();
  const year = today.getFullYear().toString();
  const monthNum = today.getMonth() + 1;
  const month = (monthNum < 10 ? '0' : '') + monthNum.toString();
  const todayNum = today.getDate();
  const date = (todayNum < 10 ? '0' : '') + todayNum.toString();
  return `${year}-${month}-${date}`;
}

/**
 * Takes a color name and converts it into a string of a hex color.
 * @param color A string of a color name.
 * @returns A string of a hex code for the given color.
 */
export function convertColor(color: string): string {
  switch (color) {
    case 'red':
      return '#FF5A5A';
    case 'orange':
      return '#F29930';
    case 'yellow':
      return '#F2EA30';
    case 'green':
      return '#31F22D';
    case 'blue':
      return '#35E6F1';
    case 'purple':
      return '#D289FF';
    case 'pink':
      return '#FF7EFA';
    default:
      return '#808080';
  }
}

/**
 * Takes a color name and converts it into a string of a hex color for a
 * lighter version of the color.
 * @param color A string of a color name.
 * @returns A string of a hex code for the given color.
 */
export function convertColorLight(color: string) {
  switch (color) {
    case 'red':
      return '#FFE6E6';
    case 'orange':
      return '#FDF0E0';
    case 'yellow':
      return '#FDFCE0';
    case 'green':
      return '#DAFCD9';
    case 'blue':
      return '#D9FDFF';
    case 'purple':
      return '#F8EEFF';
    case 'pink':
      return '#FFECFE';
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
