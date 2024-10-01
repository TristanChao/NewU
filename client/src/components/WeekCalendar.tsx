import { useEffect, useState } from 'react';
import { HabitMarker } from './HabitMarker';
import { convertColorLightBg } from '../lib';

type Props = {
  color: string;
};
export function WeekCalendar({ color }: Props) {
  const [days, setDays] = useState<JSX.Element[]>([]);

  let calendarStyle = 'flex justify-around rounded py-[10px]';

  calendarStyle += convertColorLightBg(color);

  // creates a set of habit marks representing the week
  useEffect(() => {
    const dayArray = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

    const dayMarkerArray = dayArray.map((_day, i): JSX.Element => {
      return (
        <div key={i}>
          {/* <h1 className="text-center text-[24px]">{day}</h1> */}
          <HabitMarker color={color} mark={true} />
        </div>
      );
    });

    setDays(dayMarkerArray);
  }, [color]);

  return <div className={calendarStyle}>{days}</div>;
}
