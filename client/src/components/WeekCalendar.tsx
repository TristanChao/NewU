import { useEffect, useState } from 'react';
import { HabitMarker } from './HabitMarker';
import { convertColorLight } from '../lib';

type Props = {
  color: string;
};
export function WeekCalendar({ color }: Props) {
  const [days, setDays] = useState<JSX.Element[]>([]);

  const calendarStyle = `flex justify-around rounded py-[10px]
    bg-[${convertColorLight(color)}]`;

  useEffect(() => {
    const dayArray = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

    const dayMarkerArray = dayArray.map((day, i): JSX.Element => {
      return (
        <div key={i}>
          <h1 className="text-center text-[24px]">{day}</h1>
          <HabitMarker color={color} mark={true} />
        </div>
      );
    });

    setDays(dayMarkerArray);
  }, [color]);

  return <div className={calendarStyle}>{days}</div>;
}
