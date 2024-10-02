import { useState } from 'react';
import { convertColorBg } from '../lib';

export function CalendarForm() {
  const [color, setColor] = useState('red');

  let headerDivStyle = `py-[10px] px-[15px] big:px-[50px] min-h-[60px]
    flex items-center justify-between mb-[15px]`;

  headerDivStyle += convertColorBg(color);

  return (
    <>
      <div className={headerDivStyle}>
        <h1 className="text-[24px] max-w-[90%]">New Habit</h1>
      </div>
      <div className="px-[15px] big:px-[50px]">
        <label>Name</label>
        <input></input>
      </div>
    </>
  );
}
