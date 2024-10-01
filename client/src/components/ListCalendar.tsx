import { Link } from 'react-router-dom';
import { HabitMarker } from './HabitMarker';
import { convertColorLightBg } from '../lib';
import { useEffect, useState } from 'react';
import { WeekCalendar } from './WeekCalendar';

type Props = {
  calendarId: number;
  name: string;
  color: string;
  mark: boolean;
};
export function ListCalendar({ calendarId, name, color, mark }: Props) {
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

  return (
    <Link to={`/calendar/${calendarId}`}>
      <div className={calDivStyle}>
        <span className="text-[20px]">{name}</span>
        {windowWidth >= 700 ? (
          <div className="basis-2/5">
            <WeekCalendar color={color} />
          </div>
        ) : (
          <HabitMarker color={color} mark={mark} />
        )}
      </div>
    </Link>
  );
}
