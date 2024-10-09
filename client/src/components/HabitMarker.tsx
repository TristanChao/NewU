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

  if (owned) {
    buttonStyle += ' cursor-pointer';
  } else {
    buttonStyle += ' cursor-default';
  }

  buttonStyle += convertColorBorder(color);

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
