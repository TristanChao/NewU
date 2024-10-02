import { useEffect, useState } from 'react';
import { HabitMarker } from './HabitMarker';
import { Mark } from '../lib';

type ObjDateMark = {
  objDate?: Date;
  day?: number;
};

type Props = {
  color: string;
  weekMarks: Mark[];
  calendarId: number;
};
export function WeekCalendar({ color, weekMarks, calendarId }: Props) {
  const [days, setDays] = useState<JSX.Element[]>([]);
  const [weekCompletion, setWeekCompletion] = useState<boolean[]>([]);
  const [marks, setMarks] = useState<(Mark & ObjDateMark)[]>([]);

  const calendarStyle = 'flex justify-around rounded';

  useEffect(() => {
    const marksArr: (Mark & ObjDateMark)[] = structuredClone(weekMarks).filter(
      (mark) => mark.calendarId === calendarId
    );
    marksArr.forEach(
      (mark) => (mark.day = new Date(mark.date + 'T00:00:00').getDay())
    );
    setMarks(marksArr);
  }, [weekMarks, calendarId]);

  useEffect(() => {
    let completionArr: boolean[] = [];

    if (marks.length === 0) {
      completionArr = [false, false, false, false, false, false, false];
    } else {
      for (let i = 0; i < 7; i++) {
        const currentMark = marks.find((mark) => mark.day === i);
        if (currentMark === undefined) {
          completionArr.push(false);
        } else {
          completionArr.push(currentMark.isCompleted);
        }
      }
    }

    setWeekCompletion(completionArr);
  }, [marks]);

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
