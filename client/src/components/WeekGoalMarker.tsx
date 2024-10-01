import { FaCheck } from 'react-icons/fa';
import { convertColorBg, convertColorBorder } from '../lib';

type Props = {
  mark: boolean;
  color: string;
};
export function WeekGoalMarker({ mark, color }: Props) {
  let buttonStyle = `rounded-full border-[5px] w-[50px] h-[50px] cursor-pointer
    flex justify-center items-center`;

  buttonStyle += convertColorBorder(color);

  if (!mark) {
    buttonStyle += ' big:hover:bg-[#64646420]';
  } else {
    buttonStyle += convertColorBg(color);
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
