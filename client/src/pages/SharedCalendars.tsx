import { useEffect, useState } from 'react';
import {
  Access,
  Calendar,
  dateToString,
  Mark,
  readSharedCals,
  readSharedWeekMarks,
} from '../lib';
import { ListCalendar } from '../components/ListCalendar';

export function SharedCalendars() {
  const [sharedCals, setSharedCals] = useState<(Calendar & Access)[]>([]);
  const [calCompArr, setCalCompArr] = useState<JSX.Element[]>([]);
  const [sharedWeekMarks, setSharedWeekMarks] = useState<Mark[]>([]);

  useEffect(() => {
    async function read() {
      const sharedCalArr = await readSharedCals();
      setSharedCals(sharedCalArr);
    }
    read();
  }, []);

  useEffect(() => {
    async function read() {
      const sharedMarks = await readSharedWeekMarks(dateToString());
      setSharedWeekMarks(sharedMarks);
    }
    read();
  }, []);

  useEffect(() => {
    const listCalsArr = sharedCals.map((cal, i) => (
      <ListCalendar
        key={i}
        calendarId={cal.calendarId}
        name={cal.name}
        color={cal.color}
        owned={false}
        weekMarks={sharedWeekMarks}
      />
    ));
    setCalCompArr(listCalsArr);
  }, [sharedCals, sharedWeekMarks]);

  return (
    <div className="px-[15px] small:px-[50px] big:px-[200px]">
      <h1 className="text-[24px] mt-[20px] mb-[15px]">Shared With Me</h1>
      {calCompArr.length > 0 ? (
        calCompArr
      ) : (
        <p>You don't have any calendars shared with you :&#40;</p>
      )}
    </div>
  );
}
