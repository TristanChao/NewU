import React, { useEffect, useState } from 'react';
import {
  Calendar,
  convertColorBg,
  convertColorLightBg,
  createInvite,
  dateToString,
  findWeekStartEnd,
  getUser,
  Mark,
  prettifyDate,
  readCalendar,
  readWeekMarks,
} from '../lib';
import { Link, useParams } from 'react-router-dom';
import { WeekGoalMarker } from '../components/WeekGoalMarker';
import { WeekCalendar } from '../components/WeekCalendar';
import { FaChevronCircleLeft, FaChevronCircleRight } from 'react-icons/fa';
import { BiLoaderCircle } from 'react-icons/bi';
import { RiPencilFill } from 'react-icons/ri';
import { IoShareSocialOutline } from 'react-icons/io5';
import { Modal } from '../components/Modal';
import { FaXmark } from 'react-icons/fa6';
import { useUser } from '../components/useUser';

export function CalendarDetails() {
  const { user } = useUser();

  const [isLoading, setIsLoading] = useState(true);
  const [calIsLoading, setCalIsLoading] = useState(false);
  const [inviteIsLoading, setInviteIsLoading] = useState(false);
  const [error, setError] = useState<unknown>();

  const [calendar, setCalendar] = useState<Calendar>();
  const [marks, setMarks] = useState<Mark[]>([]);
  const { calendarId } = useParams();

  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [goalProgress, setGoalProgress] = useState(0);

  const [shareIsOpen, setShareIsOpen] = useState(false);
  const [shareInput, setShareInput] = useState<string>();

  // queries for the calendar whose id is in the url upon mounting
  useEffect(() => {
    async function read() {
      try {
        setCalIsLoading(true);
        if (calendarId === undefined) throw new Error("shouldn't happen");
        setCalendar(await readCalendar(calendarId));
        const allWeekMarks = await readWeekMarks(dateToString(currentDate));
        const calWeekMarks = allWeekMarks.filter(
          (mark) => mark.calendarId === +calendarId
        );
        setMarks([...calWeekMarks]);
      } catch (err) {
        console.error(err);
        setError(err);
      } finally {
        setIsLoading(false);
        setCalIsLoading(false);
      }
    }
    read();
  }, [calendarId, currentDate]);

  // checks weekly goal progress
  useEffect(() => {
    let progress = 0;

    marks.forEach((mark) => {
      if (
        mark.isCompleted &&
        mark.date >= findWeekStartEnd(currentDate)[0] &&
        mark.date <= findWeekStartEnd(currentDate)[1]
      ) {
        progress++;
      }
    });

    setGoalProgress(progress);
  }, [currentDate, marks]);

  // functions to set the current focus date forward, back, or reset it to today
  function handleWeekBack() {
    const newDate = new Date(currentDate);
    newDate.setDate(currentDate.getDate() - 7);
    setCurrentDate(newDate);
  }
  function handleWeekForward() {
    const newDate = new Date(currentDate);
    newDate.setDate(currentDate.getDate() + 7);
    setCurrentDate(newDate);
  }
  function handleWeekReset() {
    const newDate = new Date();
    setCurrentDate(newDate);
  }

  function updateMarks(marks: Mark[]) {
    setMarks(marks);
  }

  async function handleInvite(event: React.FormEvent<HTMLFormElement>) {
    try {
      event.preventDefault();
      setInviteIsLoading(true);
      if (!shareInput) throw new Error('must provide username');
      if (!calendarId) throw new Error("shouldn't happen");
      if (!user) throw new Error('you must be logged in');
      const shareUser = await getUser(shareInput);
      const newInvite = await createInvite({
        calendarId: +calendarId,
        ownerId: user.userId,
        shareeId: shareUser.userId,
      });
      if (!newInvite) throw new Error('calendar share was unsuccessful');
      alert('Shared your calendar!');
      setShareInput(undefined);
    } catch (err) {
      setError(err);
      console.error(err);
    } finally {
      setInviteIsLoading(false);
    }
  }

  if (isLoading) {
    return (
      <div className="px-[15px] small:px-[50px] big:px-[200px] flex text-[20px] mt-[10px]">
        <div className="flex justify-center items-center animate-spin-slow mr-[5px]">
          <BiLoaderCircle />
        </div>
        Loading...
      </div>
    );
  }

  if (error) {
    return (
      <div className="px-[15px] small:px-[50px] big:px-[200px]">
        Error! {error instanceof Error ? error.message : 'Unknown error'}
      </div>
    );
  }

  if (!calendar) {
    return <div>Can't find this calendar :&#40;</div>;
  }

  let headerDivStyle = `py-[10px] px-[15px] small:px-[50px] big:px-[200px] min-h-[60px]
    flex items-center justify-between mb-[15px]`;
  headerDivStyle += convertColorBg(calendar.color);

  const dayStyle = 'w-[40px] text-center';

  let markCalStyle = 'mb-[10px] rounded py-[10px]';
  markCalStyle += convertColorLightBg(calendar.color);

  const buttonCtnStyle = `flex justify-between absolute left-[15px]
    right-[15px] bottom-[20px] small:left-[50px] small:right-[50px]
    small:bottom-[30px] big:left-[200px] big:right-[200px]
    small:bottom-[30px]`;

  const shareBtnStyle = 'rounded w-[70px] bg-blue-200 px-[10px]';
  const shareBtnLoadingStyle = 'rounded w-[70px] bg-gray-200 px-[10px]';

  if (calendarId === undefined) throw new Error("shouldn't happen");

  return (
    <>
      {/* calendar header */}
      <div className={headerDivStyle}>
        <h1 className="text-[24px] max-w-[90%]">{calendar.name}</h1>
        <div className="flex px-[10px]">
          {/* share button */}
          <button
            onClick={() => setShareIsOpen(true)}
            className="text-[24px] mr-[20px]">
            <IoShareSocialOutline />
          </button>
          {/* edit button */}
          <Link to={`/calendar/form/${calendarId}`}>
            <div className="text-[24px]">
              <RiPencilFill />
            </div>
          </Link>
        </div>
      </div>
      {/* share modal */}
      <Modal
        className={'w-[85%] max-w-[800px] min-w-[295px]'}
        isOpen={shareIsOpen}
        onClose={() => setShareIsOpen(false)}>
        <div className="p-8">
          <div className="flex justify-between mb-[15px]">
            <h1 className="text-[20px]">Share Calendar</h1>
            {/* close button */}
            <button
              onClick={() => setShareIsOpen(false)}
              type="button"
              className="text-[20px]">
              <FaXmark />
            </button>
          </div>
          <span>
            By sharing a calendar, you can let other people view your progress!
          </span>
          {/* username input */}
          <form onSubmit={handleInvite}>
            <div className="flex mt-[10px]">
              <input
                required
                value={shareInput ? shareInput : ''}
                onChange={(e) => setShareInput(e.target.value)}
                placeholder="Add a friend by username"
                className="border rounded p-[5px] w-full mr-[10px]"
              />
              <button
                type="submit"
                className={
                  inviteIsLoading ? shareBtnLoadingStyle : shareBtnStyle
                }>
                {inviteIsLoading ? (
                  <div className="flex justify-center items-center animate-spin-slow">
                    <BiLoaderCircle />
                  </div>
                ) : (
                  'Share'
                )}
              </button>
            </div>
          </form>
        </div>
      </Modal>
      {/* calendar body */}
      <div className="px-[15px] small:px-[50px] big:px-[200px]">
        {/* week label and selectors */}
        <div className="flex items-center mb-[10px] justify-between">
          <div>
            {/* week back button */}
            <button type="button" className="mr-[5px]" onClick={handleWeekBack}>
              <FaChevronCircleLeft />
            </button>
            {/* week dates label */}
            <h1 className="inline-block text-[20px] mr-[5px]">
              {prettifyDate(findWeekStartEnd(currentDate)[0]) +
                ' to ' +
                prettifyDate(findWeekStartEnd(currentDate)[1])}
            </h1>
            {/* week forward button */}
            <button type="button" onClick={handleWeekForward}>
              <FaChevronCircleRight />
            </button>
          </div>
          {/* set date to today button */}
          <button
            type="button"
            className="py-[5px] px-[10px] border rounded hover:bg-gray-100"
            onClick={handleWeekReset}>
            Today
          </button>
        </div>
        {/* weekly goal section */}
        <div className="flex justify-between items-center mb-[10px]">
          <span className="text-[18px]">
            Your goal:
            <br />
            {calendar.goal} days a week
          </span>
          <WeekGoalMarker
            color={calendar.color}
            mark={goalProgress >= calendar.goal}
          />
        </div>
        {/* marker calendar */}
        <div className={markCalStyle}>
          {calIsLoading ? (
            <div className="h-[86px] flex justify-center items-center">
              <div className="animate-spin-slow text-[20px]">
                <BiLoaderCircle />
              </div>
            </div>
          ) : (
            <>
              <div className="basis-2/5 flex justify-around text-[24px] min-w-[280px] mb-[10px]">
                <h1 className={dayStyle}>S</h1>
                <h1 className={dayStyle}>M</h1>
                <h1 className={dayStyle}>T</h1>
                <h1 className={dayStyle}>W</h1>
                <h1 className={dayStyle}>T</h1>
                <h1 className={dayStyle}>F</h1>
                <h1 className={dayStyle}>S</h1>
              </div>
              <WeekCalendar
                color={calendar.color}
                weekMarks={marks}
                calendarId={+calendarId}
                weekStart={findWeekStartEnd(currentDate)[0] + 'T00:00'}
                onMarkUpdate={updateMarks}
              />
            </>
          )}
        </div>
        {/* description */}
        {calendar.desc ? (
          <div className="text-[18px]">
            <h3>Description</h3>
            <p>{calendar.desc}</p>
          </div>
        ) : (
          ''
        )}
        <div className={buttonCtnStyle}>
          <Link
            to="/"
            className="w-[110px] h-[40px] rounded bg-[#cdcdcd] flex justify-center items-center">
            <h1 className="text-[18px]">Back</h1>
          </Link>
        </div>
      </div>
    </>
  );
}
