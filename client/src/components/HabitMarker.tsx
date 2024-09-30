import { FaCheck } from 'react-icons/fa';

type Props = {
  mark: boolean;
  color: string;
};
export function HabitMarker({ mark, color }: Props) {
  let buttonStyle = 'rounded-full border-[5px]';

  switch (color) {
    case 'red':
      buttonStyle += ' bg-[#FF5A5A] border-[#FF5A5A]';
      break;
    case 'orange':
      buttonStyle += ' bg-[#F29930] border-[#F29930]';
      break;
    case 'yellow':
      buttonStyle += ' bg-[#F2EA30] border-[#F2EA30]';
      break;
    case 'green':
      buttonStyle += ' bg-[#31F22D] border-[#31F22D]';
      break;
    case 'blue':
      buttonStyle += ' bg-[#35E6F1] border-[#35E6F1]';
      break;
    case 'purple':
      buttonStyle += ' bg-[#D289FF] border-[#D289FF]';
      break;
    case 'pink':
      buttonStyle += ' bg-[#FF7EFA] border-[#FF7EFA]';
      break;
  }

  return (
    <button className={buttonStyle} type="button">
      {mark && <FaCheck />}
    </button>
  );
}
