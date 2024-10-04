import { useEffect, useState } from 'react';
import { HabitMarker } from './HabitMarker';
import { createMark, dateToString, Mark, updateMark } from '../lib';
import { BiLoaderCircle } from 'react-icons/bi';

type Props = {
  color: string;
  weekMarks: Mark[];
  weekStart: string;
  calendarId: number;
  onMarkUpdate: (marks: Mark[]) => void;
};
export function WeekCalendar({
  color,
  weekMarks,
  weekStart,
  calendarId,
  onMarkUpdate,
}: Props) {
  // const [days, setDays] = useState<JSX.Element[]>([]);
  const [weekCompletion, setWeekCompletion] = useState<boolean[]>([]);
  const [marks, setMarks] = useState<Mark[]>([]);

  const [isLoading, setIsLoading] = useState(false);

  const calendarStyle = 'flex justify-around rounded';

  useEffect(() => {}, [weekCompletion]);

  useEffect(() => {
    const marksArr: Mark[] = weekMarks.filter(
      (mark) => mark.calendarId === calendarId
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
      setIsLoading(true);

      const marksArr = [...marks];
      const completionArr = [...weekCompletion];
      let result: Mark;

      const markToUpdateArr = marks.filter((mark) => mark.day === day);
      let markToUpdate: Mark | undefined;
      if (markToUpdateArr.length <= 1) {
        markToUpdate = markToUpdateArr[0];
      } else {
        markToUpdate = markToUpdateArr[markToUpdateArr.length - 1];
      }
      if (markToUpdate === undefined) {
        const date = new Date(weekStart);
        date.setDate(date.getDate() + day);
        result = await createMark({
          calendarId,
          date: dateToString(date),
          isCompleted,
        });
        marksArr.push(result);
      } else {
        result = await updateMark({ markId: markToUpdate.markId, isCompleted });
        marksArr.splice(
          marksArr.findIndex((mark) => mark.day === day),
          1,
          result
        );
      }

      completionArr.splice(day, 1, result.isCompleted);

      setMarks(marksArr);
      setWeekCompletion(completionArr);
      onMarkUpdate(marksArr);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center">
        <div className="flex justify-center items-center animate-spin-slow mr-[5px] text-[20px] h-[40px]">
          <BiLoaderCircle />
        </div>
      </div>
    );
  }

  if (!isLoading) {
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
}
