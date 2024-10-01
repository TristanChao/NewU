import { useEffect, useState } from 'react';
import { HabitMarker } from './HabitMarker';
import { convertColorLightBg, Mark } from '../lib';

type objDateMark = {
  objDate?: Date;
};

type Props = {
  color: string;
  weekMarks: (Mark & objDateMark)[];
};
export function WeekCalendar({ color, weekMarks }: Props) {
  const [days, setDays] = useState<JSX.Element[]>([]);
  const [weekCompletion, setWeekCompletion] = useState<boolean[]>([]);

  let calendarStyle = 'flex justify-around rounded py-[10px]';

  calendarStyle += convertColorLightBg(color);

  useEffect(() => {
    let completionArr: boolean[] = [];

    function callbackFnc(this: number, mark: Mark & objDateMark) {
      mark.objDate?.getDay() === this;
    }

    if (!weekMarks) {
      completionArr = [false, false, false, false, false, false, false];
      console.log('weekMarks is undefined');
    } else {
      weekMarks.forEach((mark) => {
        mark.objDate = new Date(mark.date);
      });

      for (let i = 0; i < 7; i++) {
        const currentMark = weekMarks.find(callbackFnc, i);
        if (currentMark === undefined) {
          completionArr.push(false);
        } else {
          completionArr.push(currentMark.isCompleted);
        }
      }
    }

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
