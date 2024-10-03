import { useEffect, useState } from 'react';
import { convertColorBg, convertColorBorder, createCal } from '../lib';
import { CiCircleMinus, CiCirclePlus } from 'react-icons/ci';
import { useNavigate } from 'react-router-dom';

export function CalendarForm() {
  const [colorButtons, setColorButtons] = useState<JSX.Element[]>([]);
  const [color, setColor] = useState('red');
  const [name, setName] = useState<string>();
  const [goal, setGoal] = useState(7);
  const [desc, setDesc] = useState<string>();
  const navigate = useNavigate();

  let headerDivStyle = `py-[10px] px-[15px] big:px-[50px] min-h-[60px]
    flex items-center justify-between mb-[15px]`;
  headerDivStyle += convertColorBg(color);

  let saveBtnStyle = 'w-[110px] h-[40px] rounded';
  saveBtnStyle += convertColorBg(color);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    try {
      event.preventDefault();
      if (!name) throw new Error('name is required');
      const result = await createCal({
        type: 'normal',
        name,
        color,
        desc,
        goal,
      });
      alert(`Created ${result.name}`);
      navigate(`/calendar/${result.calendarId}`);
    } catch (err) {
      console.error(err);
    }
  }

  useEffect(() => {
    const colorSelectArr: JSX.Element[] = [];
    const colors = [
      'red',
      'orange',
      'yellow',
      'green',
      'blue',
      'purple',
      'pink',
    ];
    colors.forEach((element, i) => {
      let style =
        'w-[30px] h-[30px] border-[8px] rounded-full mr-[15px]' +
        convertColorBorder(element);
      if (color === element) style += convertColorBg(element);
      colorSelectArr.push(
        <button
          key={i}
          type="button"
          className={style}
          onClick={() => setColor(element)}></button>
      );
    });
    setColorButtons(colorSelectArr);
  }, [color]);

  function handleGoalMinus() {
    goal - 1 > 0 && setGoal(goal - 1);
  }
  function handleGoalPlus() {
    goal + 1 <= 7 && setGoal(goal + 1);
  }

  return (
    <>
      {/* header */}
      <div className={headerDivStyle}>
        <h1 className="text-[24px] max-w-[90%]">New Habit</h1>
      </div>

      {/* form body */}
      <form
        onSubmit={handleSubmit}
        className="px-[15px] big:px-[50px] flex flex-col">
        {/* color selectors */}
        <div className="mb-[20px]">{colorButtons}</div>
        {/* name */}
        <label className="text-[20px]" htmlFor="cal-name-input">
          Name
        </label>
        <input
          required
          id="cal-name-input"
          value={name ? name : ''}
          onChange={(e) => setName(e.target.value)}
          className="border bg-gray-100 rounded p-[5px] mb-[15px] text-[18px]"
        />
        {/* goal */}
        <label className="text-[20px]">Weekly Goal</label>
        <div className="mb-[15px] flex items-center">
          <button
            type="button"
            onClick={handleGoalMinus}
            className="text-[30px] mr-[5px]">
            <CiCircleMinus />
          </button>
          <input
            required
            type="number"
            value={goal ? goal.toString() : ''}
            onChange={(e) => setGoal(+e.target.value)}
            max="7"
            min="1"
            id="cal-goal-input"
            className="border bg-gray-100 rounded w-[40px] p-[5px] text-center text-[18px] mr-[5px]"
          />
          <button
            type="button"
            onClick={handleGoalPlus}
            className="text-[30px] mr-[10px]">
            <CiCirclePlus />
          </button>
          <span className="text-[18px]">days per week</span>
        </div>
        {/* desc */}
        <label className="text-[20px]" htmlFor="cal-name-input">
          Description &#40;optional&#41;
        </label>
        <textarea
          value={desc ? desc : ''}
          onChange={(e) => setDesc(e.target.value)}
          placeholder="What am I hoping to accomplish by starting/breaking this habit?"
          id="cal-desc-input"
          className="p-[5px] border bg-gray-100 rounded h-[200px] text-[18px]"
        />
        {/* cancel/save buttons */}
        <div className="flex justify-between absolute left-[15px] right-[15px] bottom-[20px]">
          <button
            type="button"
            className="w-[110px] h-[40px] rounded bg-[#cdcdcd]">
            <h1 className="text-[18px]">CANCEL</h1>
          </button>
          <button type="submit" className={saveBtnStyle}>
            <h1 className="text-[18px]">SAVE</h1>
          </button>
        </div>
      </form>
    </>
  );
}
