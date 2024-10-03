import { FaCheck } from 'react-icons/fa';
import { convertColorBg, convertColorBorder } from '../lib';

type Props = {
  mark: boolean;
  color: string;
  day?: number;
  onUpdate: (day, isCompleted) => void;
};
export function HabitMarker({ mark, color, day, onUpdate }: Props) {
  let buttonStyle = `rounded-full border-[5px]
    w-[40px] h-[40px] cursor-pointer
    flex justify-center items-center pointer-events-all`;

  buttonStyle += convertColorBorder(color);

  if (!mark) {
    buttonStyle += ' small:hover:bg-[#64646420]';
  } else {
    buttonStyle += convertColorBg(color);
  }

  return (
    <button
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
