import { useEffect, useState } from 'react';
import { Calendar, convertColorBg, readCalendar } from '../lib';
import { useParams } from 'react-router-dom';
import { WeekGoalMarker } from '../components/WeekGoalMarker';
import { WeekCalendar } from '../components/WeekCalendar';

export function CalendarDetails() {
  const [calendar, setCalendar] = useState<Calendar>();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<unknown>();

  const { calendarId } = useParams();

  useEffect(() => {
    async function read() {
      try {
        if (!calendarId) throw new Error("shouldn't happen");
        setCalendar(await readCalendar(calendarId));
      } catch (err) {
        console.error(err);
        setError(err);
      } finally {
        setIsLoading(false);
      }
    }

    read();
  }, [calendarId]);

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

  if (!calendar) {
    return <div>Can't find this calendar :&#40;</div>;
  }

  let headerDivStyle = `py-[10px] px-[15px] big:px-[50px] min-h-[60px]
    flex items-center justify-between`;

  headerDivStyle += convertColorBg(calendar.color);

  return (
    <>
      <div className={headerDivStyle}>
        <h1 className="text-[24px] max-w-[90%]">{calendar.name}</h1>
      </div>
      <div className="px-[15px] big:px-[50px]">
        <h1>This Week</h1>
        <div className="flex justify-between">
          <span>
            Your goal:
            <br />
            {calendar.goal} days a week
          </span>
          <WeekGoalMarker color={calendar.color} mark={false} />
        </div>
        <WeekCalendar color={calendar.color} />
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
