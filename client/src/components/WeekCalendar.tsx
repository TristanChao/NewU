import { useEffect, useState } from 'react';
import { HabitMarker } from './HabitMarker';
import { convertColorLightBg, Mark } from '../lib';

type ObjDateMark = {
  objDate?: Date;
  day?: number;
};

type Props = {
  color: string;
  weekMarks: Mark[];
};
export function WeekCalendar({ color, weekMarks }: Props) {
  const [days, setDays] = useState<JSX.Element[]>([]);
  const [weekCompletion, setWeekCompletion] = useState<boolean[]>([]);

  let calendarStyle = 'flex justify-around rounded py-[10px]';

  calendarStyle += convertColorLightBg(color);

  useEffect(() => {
    let completionArr: boolean[] = [];

    console.log(weekMarks);

    if (weekMarks === undefined) {
      completionArr = [false, false, false, false, false, false, false];
      console.log('weekMarks is undefined');
    } else {
      const marksArr: (Mark & ObjDateMark)[] = structuredClone(weekMarks);
      marksArr.forEach(
        (mark) => (mark.day = new Date(mark.date + 'T00:00:00').getDay())
      );

      for (let i = 0; i < 7; i++) {
        const currentMark = marksArr.find((mark) => mark.day === i);
        if (currentMark === undefined) {
          completionArr.push(false);
        } else {
          completionArr.push(currentMark.isCompleted);
        }
      }

      console.log({ marksArr });
    }

    console.log({ completionArr });

    setWeekCompletion(completionArr);
  }, [weekMarks]);

  // creates a set of habit marks representing the week
  useEffect(() => {
    const dayMarkerArray = weekCompletion.map((isComplete, i): JSX.Element => {
      return (
        <div key={i}>
          {/* <h1 className="text-center text-[24px]">{day}</h1> */}
          <HabitMarker color={color} mark={isComplete} />
        </div>
      );
    });

    setDays(dayMarkerArray);
  }, [weekCompletion, color]);

  return <div className={calendarStyle}>{days}</div>;
}
