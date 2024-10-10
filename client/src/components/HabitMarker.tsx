import { FaCheck } from 'react-icons/fa';
import { convertColorBg, convertColorBorder } from '../lib';

type Props = {
  mark: boolean;
  color: string;
  day?: number;
  owned: boolean;
  onUpdate: (day, isCompleted) => void;
};
export function HabitMarker({ mark, color, day, owned, onUpdate }: Props) {
  let buttonStyle = `rounded-full border-[5px]
    w-[40px] h-[40px]
    flex justify-center items-center pointer-events-all`;

  /* changes cursor style on hover over marks to reflect that non-owners cannot
   click on one and have something happen */
  if (owned) {
    buttonStyle += ' cursor-pointer';
  } else {
    buttonStyle += ' cursor-default';
  }

  buttonStyle += convertColorBorder(color);

  /* conditionally changes background color;
   - when a mark is present, the background color will be the same as for the
     calendar
   - if there isn't a mark and the calendar is owned, it will be a light grey
     on hover to reflect that you can click on it,
   - otherwise it will just be transparent */
  if (mark) {
    buttonStyle += convertColorBg(color);
  } else if (owned) {
    buttonStyle += ' small:hover:bg-[#64646420]';
  }

  return (
    <button
      id={`${day}`}
      className={buttonStyle}
      type="button"
      onClick={() => onUpdate(day, !mark)}>
      {mark && (
        <div className="text-[20px]">
          <FaCheck />
        </div>
      )}
    </button>
  );
}
