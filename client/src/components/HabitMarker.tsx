import { FaCheck } from 'react-icons/fa';

type Props = {
  mark: boolean;
  color: string;
};
export function HabitMarker({ mark, color }: Props) {
  let buttonStyle =
    'rounded-full border-[5px] w-[50px] h-[50px] cursor-pointer';

  if (!mark) {
    buttonStyle += ' big:hover:bg-[#64646420]';
  }

  switch (color) {
    case 'red':
      buttonStyle += ' border-[#FF5A5A]';
      if (mark) buttonStyle += ' bg-[#FF5A5A]';
      break;
    case 'orange':
      buttonStyle += ' border-[#F29930]';
      if (mark) buttonStyle += ' bg-[#F29930]';
      break;
    case 'yellow':
      buttonStyle += ' border-[#F2EA30]';
      if (mark) buttonStyle += ' bg-[#F2EA30]';
      break;
    case 'green':
      buttonStyle += ' border-[#31F22D]';
      if (mark) buttonStyle += ' bg-[#31F22D]';
      break;
    case 'blue':
      buttonStyle += ' border-[#35E6F1]';
      if (mark) buttonStyle += ' bg-[#35E6F1]';
      break;
    case 'purple':
      buttonStyle += ' border-[#D289FF]';
      if (mark) buttonStyle += ' bg-[#D289FF]';
      break;
    case 'pink':
      buttonStyle += ' border-[#FF7EFA]';
      if (mark) buttonStyle += ' bg-[#FF7EFA]';
      break;
  }

  return (
    <button className={buttonStyle} type="button">
      {mark && <FaCheck />}
    </button>
  );
}
