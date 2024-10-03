import { Link } from 'react-router-dom';
import { useUser } from '../components/useUser';
import { useEffect, useState } from 'react';
import {
  Calendar,
  dateToString,
  Mark,
  readCalendars,
  readWeekMarks,
  signIn,
} from '../lib';
import { ListCalendar } from '../components/ListCalendar';
import { BiLoaderCircle } from 'react-icons/bi';

export function Home() {
  const { user, handleSignIn } = useUser();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<unknown>();
  const [calendars, setCalendars] = useState<Calendar[]>([]);
  const [marks, setMarks] = useState<Mark[]>([]);
  const [calendarArray, setCalendarArray] = useState<JSX.Element[]>([]);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  // creates an event listener on the window for width resizing
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener('resize', handleResize);

    // Cleanup the event listener on component unmount
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // queries for calendars and the current week's habit marks belonging to user
  useEffect(() => {
    async function read() {
      try {
        if (!user) return;
        setCalendars(await readCalendars());
        setMarks(await readWeekMarks(dateToString()));
      } catch (err) {
        console.error(err);
        setError(err);
      }
    }
    read();
  }, [user]);

  // creates an array of list calendars
  useEffect(() => {
    const listCalendarArray: JSX.Element[] = [];
    calendars.forEach((c, i) => {
      const calMarks: Mark[] = marks.filter(
        (mark) => mark.calendarId === c.calendarId
      );
      listCalendarArray.push(
        <ListCalendar
          key={i}
          calendarId={c.calendarId}
          name={c.name}
          color={c.color}
          weekMarks={calMarks}
        />
      );
    });
    setCalendarArray(listCalendarArray);
  }, [calendars, marks]);

  // automatically logs in the demo user when called
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
    return (
      <div className="px-[15px] small:px-[50px] flex text-[20px]">
        <div className="flex justify-center items-center animate-spin-slow mr-[5px]">
          <BiLoaderCircle />
        </div>
        Loading...
      </div>
    );
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
  const dayStyle = 'w-[40px] text-center';

  return (
    <div className="px-[15px] small:px-[50px]">
      {/* if a user isn't logged in, displays register, sign in, and demo
        account buttons */}
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
      {/* if a user is logged in, displays all available calendars or a message
        saying there are no calendars */}
      {user && (
        <div className="pt-[20px]">
          <div className="flex justify-between pr-[10px] mb-[10px]">
            <h1 className="text-[24px]">My Habit Calendars</h1>
            {windowWidth >= 700 && (
              <div className="basis-2/5 flex justify-around text-[24px] min-w-[280px]">
                <h1 className={dayStyle}>S</h1>
                <h1 className={dayStyle}>M</h1>
                <h1 className={dayStyle}>T</h1>
                <h1 className={dayStyle}>W</h1>
                <h1 className={dayStyle}>T</h1>
                <h1 className={dayStyle}>F</h1>
                <h1 className={dayStyle}>S</h1>
              </div>
            )}
          </div>
          {calendarArray.length > 0 ? (
            calendarArray
          ) : (
            <p className="text-center text-gray-500">
              You don't have any calendars yet!
            </p>
          )}
          <div className="flex justify-center mt-[15px]">
            <Link
              to="/calendar/form/0"
              className="bg-[#ececec] rounded-[10px] py-[10px] w-[60%] text-center">
              <h1 className="text-[18px]">+ Create New</h1>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
