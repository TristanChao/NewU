import { FaCheck } from 'react-icons/fa';
import { convertColor } from '../lib';

type Props = {
  mark: boolean;
  color: string;
};
export function HabitMarker({ mark, color }: Props) {
  let buttonStyle = `rounded-full border-[5px]
    w-[40px] h-[40px] cursor-pointer
    flex justify-center items-center border-[${convertColor(color)}]`;

  if (!mark) {
    buttonStyle += ' big:hover:bg-[#64646420]';
  } else {
    buttonStyle += ` bg-[${convertColor(color)}]`;
  }

  return (
    <button className={buttonStyle} type="button">
      {mark && (
        <div className="text-[20px]">
          <FaCheck />
        </div>
      )}
    </button>
  );
}
