import { Link } from 'react-router-dom';
import { HabitMarker } from './HabitMarker';

type Props = {
  calendarId: number;
  name: string;
  color: string;
  mark: boolean;
};
export function ListCalendar({ calendarId, name, color, mark }: Props) {
  let calDivStyle =
    'rounded-[15px] flex justify-between items-center py-[5px] px-[10px] min-h-[75px] cursor-pointer';

  switch (color) {
    case 'red':
      calDivStyle += ' bg-[#FFE6E6]';
      break;
    case 'orange':
      calDivStyle += ' bg-[#FDF0E0]';
      break;
    case 'yellow':
      calDivStyle += ' bg-[#FDFCE0]';
      break;
    case 'green':
      calDivStyle += ' bg-[#DAFCD9]';
      break;
    case 'blue':
      calDivStyle += ' bg-[#D9FDFF]';
      break;
    case 'purple':
      calDivStyle += ' bg-[#F8EEFF]';
      break;
    case 'pink':
      calDivStyle += ' bg-[#FFECFE]';
      break;
  }

  return (
    <Link to={`/calendar/${calendarId}`}>
      <div className={calDivStyle}>
        <span className="text-[20px]">{name}</span>
        <HabitMarker color={color} mark={mark} />
      </div>
    </Link>
  );
}
