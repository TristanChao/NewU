import { Link } from 'react-router-dom';
import { HabitMarker } from './HabitMarker';
import {
  convertColorLightBg,
  createMark,
  dateToString,
  Mark,
  updateMark,
} from '../lib';
import { WeekCalendar } from './WeekCalendar';

type Props = {
  calendarId: number;
  name: string;
  color: string;
  weekMarks: Mark[];
  weekStart?: string;
};
export function ListCalendar({
  calendarId,
  name,
  color,
  weekMarks,
  weekStart,
}: Props) {
  // const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  if (weekStart === undefined) {
    weekStart = dateToString(new Date());
  }

  let calDivStyle = `rounded-[15px] flex justify-between items-center
    py-[5px] px-[10px] min-h-[75px] cursor-pointer mb-[10px]`;

  calDivStyle += convertColorLightBg(color);

  const currentDate = dateToString();
  let todaysMark = weekMarks.find((mark) => mark.date === currentDate);

  async function handleUpdateSingleMark() {
    try {
      let result: Mark;
      if (!todaysMark) {
        result = await createMark({
          calendarId,
          date: dateToString(),
          isCompleted: true,
        });
      } else {
        result = await updateMark({
          markId: todaysMark.markId,
          isCompleted: todaysMark.isCompleted,
        });
      }
      todaysMark = result;
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <Link to={`/calendar/${calendarId}`}>
      <div className={calDivStyle}>
        <span className="text-[20px]">{name}</span>
        <div className="hidden med:block basis-2/5">
          <WeekCalendar
            color={color}
            weekMarks={weekMarks}
            calendarId={calendarId}
            weekStart={weekStart}
          />
        </div>
        <div className="block med:hidden">
          <HabitMarker
            color={color}
            mark={todaysMark ? todaysMark.isCompleted : false}
            day={new Date().getDay()}
            onUpdate={handleUpdateSingleMark}
          />
        </div>
      </div>
    </Link>
  );
}
