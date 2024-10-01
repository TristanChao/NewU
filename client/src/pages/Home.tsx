import { Link } from 'react-router-dom';
import { useUser } from '../components/useUser';
import { useEffect, useState } from 'react';
import {
  Calendar,
  dateToString,
  Mark,
  readCalendars,
  readDateMarks,
  signIn,
} from '../lib';
import { ListCalendar } from '../components/ListCalendar';

export function Home() {
  const { user, handleSignIn } = useUser();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<unknown>();
  const [calendars, setCalendars] = useState<Calendar[]>([]);
  const [marks, setMarks] = useState<Mark[]>([]);
  const [calendarArray, setCalendarArray] = useState<JSX.Element[]>([]);

  useEffect(() => {
    const localAuthJson = localStorage.getItem('um.auth');
    if (localAuthJson) {
      const localAuth = JSON.parse(localAuthJson);
      handleSignIn(localAuth.user, localAuth.token);
    }
  }, [handleSignIn]);

  useEffect(() => {
    async function read() {
      try {
        if (!user) return;
        setCalendars(await readCalendars());
        setMarks(await readDateMarks(dateToString()));
      } catch (err) {
        console.error(err);
        setError(err);
      }
    }

    read();
  }, [user]);

  useEffect(() => {
    const listCalendarArray: JSX.Element[] = [];
    calendars.forEach((c, i) => {
      const dayMark = marks.find((mark) => mark.calendarId === c.calendarId);
      const dayMarkIsComplete = dayMark ? dayMark.isCompleted : false;
      listCalendarArray.push(
        <ListCalendar
          key={i}
          calendarId={c.calendarId}
          name={c.name}
          color={c.color}
          mark={dayMarkIsComplete}
        />
      );
    });
    setCalendarArray(listCalendarArray);
  }, [calendars, marks]);

  async function onDemoClick() {
    try {
      setIsLoading(true);
      const body = {
        username: 'demo',
        password: 'demoPassword987',
      };
      const { user, token } = await signIn(body);
      handleSignIn(user, token);
    } catch (err) {
      console.error(err);
      setError(err);
    } finally {
      setIsLoading(false);
    }
  }

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return (
      <div>
        Error! {error instanceof Error ? error.message : 'Unknown error'}
      </div>
    );
  }

  const buttonLayout =
    'py-[5px] px-[10px] rounded bg-[#B9FBFF] cursor-pointer text-xl';

  return (
    <div className="px-[15px] big:px-[50px]">
      {!user && (
        <div className="mt-[30vh] flex justify-center">
          <div className="flex flex-col items-center">
            <p className="text-3xl mb-4">Welcome to NewU!</p>
            <div className="space-x-5 mb-2">
              <Link to="/register" className={buttonLayout}>
                Register
              </Link>
              <Link to="/sign-in" className={buttonLayout}>
                Sign In
              </Link>
            </div>
            <span className="text-lg">or</span>
            <a
              className="cursor-pointer mt-0 text-gray-600 underline text-lg"
              onClick={onDemoClick}>
              see the demo
            </a>
          </div>
        </div>
      )}
      {user && (
        <div className="pt-[20px]">
          <h1 className="text-[24px] mb-[10px]">My Habit Calendars</h1>
          {calendarArray.length > 0 ? (
            calendarArray
          ) : (
            <p className="text-center text-gray-500">
              You don't have any calendars yet!
            </p>
          )}
        </div>
      )}
    </div>
  );
}
