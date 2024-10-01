import { Link } from 'react-router-dom';
import { HabitMarker } from './HabitMarker';
import { convertColorLightBg, dateToString, Mark } from '../lib';
import { useEffect, useState } from 'react';
import { WeekCalendar } from './WeekCalendar';

type Props = {
  calendarId: number;
  name: string;
  color: string;
  weekMarks: Mark[];
};
export function ListCalendar({ calendarId, name, color, weekMarks }: Props) {
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener('resize', handleResize);

    // Cleanup the event listener on component unmount
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  let calDivStyle = `rounded-[15px] flex justify-between items-center
    py-[5px] px-[10px] min-h-[75px] cursor-pointer`;

  calDivStyle += convertColorLightBg(color);

  const currentDate = dateToString();
  const todaysMark = weekMarks.find((mark) => (mark.date = currentDate));

  return (
    <Link to={`/calendar/${calendarId}`}>
      <div className={calDivStyle}>
        <span className="text-[20px]">{name}</span>
        {windowWidth >= 700 ? (
          <div className="basis-2/5">
            <WeekCalendar color={color} weekMarks={weekMarks} />
          </div>
        ) : (
          <HabitMarker
            color={color}
            mark={todaysMark ? todaysMark.isCompleted : false}
          />
        )}
      </div>
    </Link>
  );
}
