import { useEffect, useState } from 'react';
import { HabitMarker } from './HabitMarker';
import { createMark, dateToString, Mark, updateMark } from '../lib';

type DayMark = {
  day?: number;
};

type Props = {
  color: string;
  weekMarks: Mark[];
  weekStart: string;
  calendarId: number;
};
export function WeekCalendar({
  color,
  weekMarks,
  weekStart,
  calendarId,
}: Props) {
  // const [days, setDays] = useState<JSX.Element[]>([]);
  const [weekCompletion, setWeekCompletion] = useState<boolean[]>([]);
  const [marks, setMarks] = useState<(Mark & DayMark)[]>([]);

  const calendarStyle = 'flex justify-around rounded';

  weekStart = '2024-09-29T00:00:00';

  useEffect(() => {
    const marksArr: (Mark & DayMark)[] = structuredClone(weekMarks).filter(
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

  async function handleUpdateMark(
    day: number,
    isCompleted: boolean
  ): Promise<void> {
    try {
      const marksArr = structuredClone(marks);
      const completionArr = structuredClone(weekCompletion);
      let result: Mark;

      const markToUpdate = marks.find((mark) => mark.day === day);
      if (markToUpdate === undefined) {
        const date = new Date(weekStart);
        date.setDate(date.getDate() + day);
        result = await createMark({
          calendarId,
          date: dateToString(date),
          isCompleted,
        });
        marksArr.splice(day, 0, result);
      } else {
        result = await updateMark({ markId: markToUpdate.markId, isCompleted });
        marksArr.splice(day, 1, result);
      }

      completionArr.splice(day, 1, result.isCompleted);

      setMarks(marksArr);
      setWeekCompletion(completionArr);
    } catch (err) {
      console.error(err);
    }
  }

  // // creates a set of habit marks representing the week
  // useEffect(() => {
  //   const dayMarkerArray = weekCompletion.map((isCompleted, i): JSX.Element => {
  //     return (
  //       <div key={i}>
  //         {/* <h1 className="text-center text-[24px]">{day}</h1> */}
  //         <HabitMarker color={color} mark={isCompleted} day={i} onUpdate={handleUpdateMark} />
  //       </div>
  //     );
  //   });

  //   setDays(dayMarkerArray);
  // }, [weekCompletion, color]);

  return (
    <div className={calendarStyle}>
      <HabitMarker
        color={color}
        mark={weekCompletion[0]}
        day={0}
        onUpdate={handleUpdateMark}
      />
      <HabitMarker
        color={color}
        mark={weekCompletion[1]}
        day={1}
        onUpdate={handleUpdateMark}
      />
      <HabitMarker
        color={color}
        mark={weekCompletion[2]}
        day={2}
        onUpdate={handleUpdateMark}
      />
      <HabitMarker
        color={color}
        mark={weekCompletion[3]}
        day={3}
        onUpdate={handleUpdateMark}
      />
      <HabitMarker
        color={color}
        mark={weekCompletion[4]}
        day={4}
        onUpdate={handleUpdateMark}
      />
      <HabitMarker
        color={color}
        mark={weekCompletion[5]}
        day={5}
        onUpdate={handleUpdateMark}
      />
      <HabitMarker
        color={color}
        mark={weekCompletion[6]}
        day={6}
        onUpdate={handleUpdateMark}
      />
    </div>
  );
}
