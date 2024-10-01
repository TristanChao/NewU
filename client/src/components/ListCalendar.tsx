import { Link } from 'react-router-dom';
import { HabitMarker } from './HabitMarker';
import { convertColorLightBg } from '../lib';

type Props = {
  calendarId: number;
  name: string;
  color: string;
  mark: boolean;
};
export function ListCalendar({ calendarId, name, color, mark }: Props) {
  let calDivStyle = `rounded-[15px] flex justify-between items-center
    py-[5px] px-[10px] min-h-[75px] cursor-pointer`;

  calDivStyle += convertColorLightBg(color);

  return (
    <Link to={`/calendar/${calendarId}`}>
      <div className={calDivStyle}>
        <span className="text-[20px]">{name}</span>
        <HabitMarker color={color} mark={mark} />
      </div>
    </Link>
  );
}
