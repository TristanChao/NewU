import { useEffect, useState } from 'react';
import {
  Calendar,
  convertColorBg,
  convertColorBorder,
  createCal,
  deleteCal,
  readCalendar,
  updateCal,
} from '../lib';
import { CiCircleMinus, CiCirclePlus } from 'react-icons/ci';
import { useNavigate, useParams } from 'react-router-dom';
import { Modal } from '../components/Modal';

export function CalendarForm() {
  const [colorButtons, setColorButtons] = useState<JSX.Element[]>([]);
  const [color, setColor] = useState('red');
  const [name, setName] = useState<string>();
  const [goal, setGoal] = useState(7);
  const [desc, setDesc] = useState<string>();
  const [deleteIsOpen, setDeleteIsOpen] = useState(false);
  const { calendarId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    async function read() {
      try {
        if (calendarId === undefined) throw new Error("shouldn't happen");
        const calendar = (await readCalendar(calendarId)) as Calendar;
        if (!calendar) throw new Error('Error fetching calendar');
        setName(calendar.name);
        setGoal(calendar.goal);
        setDesc(calendar.desc);
        setColor(calendar.color);
      } catch (err) {
        console.error(err);
      }
    }

    if (calendarId === undefined) throw new Error("shouldn't happen");

    if (+calendarId > 0) {
      read();
    }
  }, [calendarId]);

  let headerDivStyle = `py-[10px] px-[15px] small:px-[50px] big:px-[200px] min-h-[60px]
    flex items-center justify-between mb-[15px]`;
  headerDivStyle += convertColorBg(color);

  let saveBtnStyle = 'w-[110px] h-[40px] rounded';
  saveBtnStyle += convertColorBg(color);

  const buttonCtnStyle = `flex justify-between absolute left-[15px]
    right-[15px] bottom-[20px] small:left-[50px] small:right-[50px]
    small:bottom-[30px] big:left-[200px] big:right-[200px]
    small:bottom-[30px]`;

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    try {
      event.preventDefault();
      if (!name) throw new Error('name is required');
      let result: Calendar;
      if (Number(calendarId) === 0) {
        result = await createCal({
          type: 'normal',
          name,
          color,
          desc,
          goal,
        });
        alert(`Created ${result.name}`);
      } else {
        result = await updateCal({
          calendarId: Number(calendarId),
          type: 'normal',
          name,
          color,
          desc,
          goal,
        });
        alert(`Updated ${result.name}`);
      }
      navigate(`/calendar/${result.calendarId}`);
    } catch (err) {
      console.error(err);
    }
  }

  async function handleDelete() {
    try {
      if (!calendarId) throw new Error("shouldn't happen");
      const deletedCal = await deleteCal(calendarId);
      alert(`Deleted ${deletedCal.name}`);
      setName(undefined);
      setGoal(0);
      setDesc(undefined);
      setColor('red');
      navigate('/');
    } catch (err) {
      console.error(err);
      alert('Oops, something went wrong!');
    }
  }

  function handleCancel() {
    navigate('/');
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
        <h1 className="text-[24px] max-w-[90%]">
          {Number(calendarId) > 0 ? 'Edit Habit' : 'New Habit'}
        </h1>
      </div>

      {/* form body */}
      <form
        onSubmit={handleSubmit}
        className="px-[15px] small:px-[50px] big:px-[200px] flex flex-col">
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
          className="p-[5px] border bg-gray-100 rounded h-[200px] text-[18px] mb-[20px]"
        />
        {Number(calendarId) > 0 && (
          <div className="">
            <button
              type="button"
              onClick={() => setDeleteIsOpen(true)}
              className="text-red-500 text-[18px]">
              Delete Calendar
            </button>
          </div>
        )}
        {/* cancel/save buttons */}
        <div className={buttonCtnStyle}>
          <button
            type="button"
            onClick={handleCancel}
            className="w-[110px] h-[40px] rounded bg-[#cdcdcd]">
            <h1 className="text-[18px]">CANCEL</h1>
          </button>
          <button type="submit" className={saveBtnStyle}>
            <h1 className="text-[18px]">SAVE</h1>
          </button>
        </div>
      </form>
      <Modal isOpen={deleteIsOpen} onClose={() => setDeleteIsOpen(false)}>
        <div className="p-10">
          <p className="text-[20px] text-center">
            Are you sure you want to delete this habit calendar?
            <br />
            WARNING: This cannot be undone!
          </p>
          <div className="flex justify-between mt-[40px] px-[20px]">
            <button
              type="button"
              onClick={() => setDeleteIsOpen(false)}
              className="px-4 py-2 bg-gray-300 rounded">
              CANCEL
            </button>
            <button
              type="button"
              onClick={handleDelete}
              className="px-4 py-2 bg-red-400 rounded">
              DELETE
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
}
