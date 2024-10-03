import { useEffect, useState } from 'react';
import {
  Calendar,
  convertColorBg,
  convertColorLightBg,
  dateToString,
  findWeekStartEnd,
  Mark,
  prettifyDate,
  readCalendar,
  readWeekMarks,
} from '../lib';
import { useParams } from 'react-router-dom';
import { WeekGoalMarker } from '../components/WeekGoalMarker';
import { WeekCalendar } from '../components/WeekCalendar';
import { FaChevronCircleLeft, FaChevronCircleRight } from 'react-icons/fa';
import { BiLoaderCircle } from 'react-icons/bi';

export function CalendarDetails() {
  const [calendar, setCalendar] = useState<Calendar>();
  const [isLoading, setIsLoading] = useState(true);
  const [calIsLoading, setCalIsLoading] = useState(false);
  const [error, setError] = useState<unknown>();
  const [marks, setMarks] = useState<Mark[]>([]);
  const [date, setDate] = useState<Date>(new Date());

  const { calendarId } = useParams();

  // queries for the calendar whose id is in the url upon mounting
  useEffect(() => {
    async function read() {
      try {
        setCalIsLoading(true);
        if (calendarId === undefined) throw new Error("shouldn't happen");
        setCalendar(await readCalendar(calendarId));
        const allWeekMarks = await readWeekMarks(dateToString(date));
        const calWeekMarks = allWeekMarks.filter(
          (mark) => mark.calendarId === +calendarId
        );
        setMarks([...calWeekMarks]);
      } catch (err) {
        console.error(err);
        setError(err);
      } finally {
        setIsLoading(false);
        setCalIsLoading(false);
      }
    }
    read();
  }, [calendarId, date]);

  useEffect(() => {
    console.log(marks);
  }, [marks]);

  function handleWeekBack() {
    const newDate = new Date(date);
    newDate.setDate(date.getDate() - 7);
    setDate(newDate);
  }
  function handleWeekForward() {
    const newDate = new Date(date);
    newDate.setDate(date.getDate() + 7);
    setDate(newDate);
  }
  function handleWeekReset() {
    const newDate = new Date();
    setDate(newDate);
  }

  if (isLoading) {
    return <div className="px-[15px] small:px-[50px]">Loading...</div>;
  }

  if (error) {
    return (
      <div className="px-[15px] small:px-[50px]">
        Error! {error instanceof Error ? error.message : 'Unknown error'}
      </div>
    );
  }

  if (!calendar) {
    return <div>Can't find this calendar :&#40;</div>;
  }

  let headerDivStyle = `py-[10px] px-[15px] small:px-[50px] min-h-[60px]
    flex items-center justify-between mb-[15px]`;
  const dayStyle = 'w-[40px] text-center';
  let markCalStyle = 'mb-[10px] rounded py-[10px]';

  markCalStyle += convertColorLightBg(calendar.color);

  headerDivStyle += convertColorBg(calendar.color);

  if (calendarId === undefined) throw new Error("shouldn't happen");

  return (
    <>
      <div className={headerDivStyle}>
        <h1 className="text-[24px] max-w-[90%]">{calendar.name}</h1>
      </div>
      <div className="px-[15px] small:px-[50px]">
        <div className="flex items-center mb-[10px] justify-between">
          <div>
            <button type="button" className="mr-[5px]" onClick={handleWeekBack}>
              <FaChevronCircleLeft />
            </button>
            <h1 className="inline-block text-[20px] mr-[5px]">
              {prettifyDate(findWeekStartEnd(date)[0]) +
                ' to ' +
                prettifyDate(findWeekStartEnd(date)[1])}
            </h1>
            <button type="button" onClick={handleWeekForward}>
              <FaChevronCircleRight />
            </button>
          </div>
          <button
            type="button"
            className="py-[5px] px-[10px] border rounded hover:bg-gray-100"
            onClick={handleWeekReset}>
            Today
          </button>
        </div>
        <div className="flex justify-between mb-[10px]">
          <span>
            Your goal:
            <br />
            {calendar.goal} days a week
          </span>
          <WeekGoalMarker color={calendar.color} mark={false} />
        </div>
        <div className={markCalStyle}>
          {calIsLoading ? (
            <div className="h-[86px] flex justify-center items-center">
              <div className="animate-spin-slow text-[20px]">
                <BiLoaderCircle />
              </div>
            </div>
          ) : (
            <>
              <div className="basis-2/5 flex justify-around text-[24px] min-w-[280px] mb-[10px]">
                <h1 className={dayStyle}>S</h1>
                <h1 className={dayStyle}>M</h1>
                <h1 className={dayStyle}>T</h1>
                <h1 className={dayStyle}>W</h1>
                <h1 className={dayStyle}>T</h1>
                <h1 className={dayStyle}>F</h1>
                <h1 className={dayStyle}>S</h1>
              </div>
              <WeekCalendar
                color={calendar.color}
                weekMarks={marks}
                calendarId={+calendarId}
                weekStart={findWeekStartEnd(date)[0] + 'T00:00'}
              />
            </>
          )}
        </div>
        {calendar.desc ? (
          <>
            <h3>Description</h3>
            <p>{calendar.desc}</p>
          </>
        ) : (
          ''
        )}
      </div>
    </>
  );
}
