import { useCallback, useEffect, useState } from 'react';
import {
  CalendarShare,
  convertColorLightBg,
  createAccess,
  deleteInvite,
  readInvites,
} from '../lib';
import { FaCheck, FaXmark } from 'react-icons/fa6';

export function ShareInvites() {
  const [inviteObjArr, setInviteObjArr] = useState<CalendarShare[]>([]);
  const [inviteCompArr, setInviteCompArr] = useState<JSX.Element[]>([]);

  const handleAccept = useCallback(async (calendarId: number) => {
    try {
      await createAccess({ calendarId, accessType: 'viewer' });
      await deleteInvite(calendarId);
      const inviteArr = (await readInvites()) as CalendarShare[];
      setInviteObjArr(inviteArr);
    } catch (err) {
      console.error(err);
    }
  }, []);

  const handleReject = useCallback(async (calendarId: number) => {
    try {
      await deleteInvite(calendarId);
      const inviteArr = (await readInvites()) as CalendarShare[];
      setInviteObjArr(inviteArr);
    } catch (err) {
      console.error(err);
    }
  }, []);

  useEffect(() => {
    async function read() {
      try {
        const invites = await readInvites();
        setInviteObjArr(invites);
      } catch (err) {
        console.error(err);
      }
    }
    read();
  }, []);

  useEffect(() => {
    // filter method used to remove duplicates
    const uniqueInvites = inviteObjArr.filter(
      (invite, index) =>
        inviteObjArr.findIndex(
          (obj) => obj.calendarId === invite.calendarId
        ) === index
    );
    const invitesArr = uniqueInvites.map((invite, i) => (
      <Invitation
        key={i}
        ownerUsername={invite.ownerUsername}
        ownerDisplayName={invite.ownerDisplayName}
        calendarId={invite.calendarId}
        calendarName={invite.calendarName}
        color={invite.color}
        handleAccept={handleAccept}
        handleReject={handleReject}
      />
    ));
    setInviteCompArr(invitesArr);
  }, [inviteObjArr, handleAccept, handleReject]);

  return (
    <div className="px-[15px] small:px-[50px] big:px-[200px]">
      <h1 className="text-[24px] mt-[20px] mb-[15px]">
        Calendar Share Requests
      </h1>
      {inviteCompArr.length > 0 ? (
        <>
          <div className="flex items-center px-[20px] text-[20px] mt-[15px] mb-[10px]">
            <h1 className="basis-2/5">Calendar Name</h1>
            <h1 className="basis-2/5">Owner</h1>
            <h1 className="basis-1/5 text-right">Actions</h1>
          </div>
          {inviteCompArr}
        </>
      ) : (
        <span className="text-[18px] text-gray-400">
          No pending invitations
        </span>
      )}
    </div>
  );
}

type InvitationProps = {
  ownerUsername: string;
  ownerDisplayName: string;
  calendarId: number;
  calendarName: string;
  color: string;
  handleAccept: (calendarId: number) => void;
  handleReject: (calendarId: number) => void;
};
function Invitation({
  ownerUsername,
  ownerDisplayName,
  calendarId,
  calendarName,
  color,
  handleAccept,
  handleReject,
}: InvitationProps) {
  let divStyle =
    'rounded mb-[15px] py-[10px] px-[20px] text-[18px] flex items-center';
  divStyle += convertColorLightBg(color);

  return (
    <div className={divStyle}>
      <h1 className="basis-2/5">{calendarName}</h1>
      <span className="basis-2/5">
        {ownerUsername +
          (ownerDisplayName === ownerUsername ? '' : ` (${ownerDisplayName})`)}
      </span>
      <div className="basis-1/5 flex justify-end">
        <button
          type="button"
          onClick={() => handleAccept(calendarId)}
          className="w-[35px] h-[35px] flex justify-center items-center rounded-full border border-green-500 text-green-500 bg-green-200 mr-[10px] text-[20px]">
          <FaCheck />
        </button>
        <button
          type="button"
          onClick={() => handleReject(calendarId)}
          className="w-[35px] h-[35px] flex justify-center items-center rounded-full border border-red-500 text-red-500 bg-red-200 text-[20px]">
          <FaXmark />
        </button>
      </div>
    </div>
  );
}
