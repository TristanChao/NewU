import { useEffect, useState } from 'react';
import {
  Access,
  Calendar,
  dateToString,
  readSharedCals,
  readWeekMarks,
} from '../lib';

export function SharedCalendars() {
  const [sharedCals, setSharedCals] = useState<(Calendar & Access)[]>([]);
  const [calCompArr, setCalCompArr] = useState<JSX.Element[]>([]);

  useEffect(() => {
    async function read() {
      const sharedCalArr = await readSharedCals();
      setSharedCals(sharedCalArr);
    }
    read();
  }, []);

  useEffect(() => {
    async function read() {
      const sharedMarks = await readWeekMarks(dateToString());
    }
  }, []);

  useEffect(() => {
    const listCalsArr = sharedCals.map((cal) => (
      <ListCalendar
        calendarId={cal.calendarId}
        name={cal.name}
        color={cal.color}
      />
    ));
  }, [sharedCals]);

  return (
    <div className="px-[15px] small:px-[50px] big:px-[200px]">
      <h1 className="text-[24px] mt-[20px]">Shared With Me</h1>
    </div>
  );
}
