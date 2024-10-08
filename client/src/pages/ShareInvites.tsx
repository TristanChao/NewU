import { useEffect, useState } from 'react';
import { convertColorBg, convertColorLightBg, readInvites } from '../lib';
import { FaCheck, FaXmark } from 'react-icons/fa6';

export function ShareInvites() {
  const [invites, setInvites] = useState<JSX.Element[]>([]);

  useEffect(() => {
    async function read() {
      try {
        const invites = await readInvites();
        // filter method used to remove duplicates
        const uniqueInvites = invites.filter(
          (invite, index) =>
            invites.findIndex((obj) => obj.calendarId === invite.calendarId) ===
            index
        );
        const invitesArr = uniqueInvites.map((invite, i) => (
          <Invitation
            key={i}
            ownerUsername={invite.ownerUsername}
            ownerDisplayName={invite.ownerDisplayName}
            calendarId={invite.calendarId}
            calendarName={invite.calendarName}
            color={invite.color}
          />
        ));
        setInvites(invitesArr);
      } catch (err) {
        console.error(err);
      }
    }
    read();
  }, []);

  return (
    <div className="px-[15px] small:px-[50px] big:px-[200px]">
      <h1 className="text-[24px] mt-[20px]">Calendar Share Requests</h1>
      <div className="flex items-center px-[20px] text-[20px] mt-[15px] mb-[10px]">
        <h1 className="basis-2/5">Calendar Name</h1>
        <h1 className="basis-2/5">Owner</h1>
        <h1 className="basis-1/5 text-right">Actions</h1>
      </div>
      {invites}
    </div>
  );
}

type InvitationProps = {
  ownerUsername: string;
  ownerDisplayName: string;
  calendarId: number;
  calendarName: string;
  color: string;
};
function Invitation({
  ownerUsername,
  ownerDisplayName,
  calendarId,
  calendarName,
  color,
}: InvitationProps) {
  let divStyle =
    'rounded mb-[15px] py-[10px] px-[20px] text-[18px] flex items-center';
  divStyle += convertColorLightBg(color);

  async function handleAccept() {
    try {
    } catch (err) {
      console.error(err);
    }
  }

  async function handleReject() {
    try {
    } catch (err) {
      console.error(err);
    }
  }

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
          className="w-[30px] h-[30px] flex justify-center items-center rounded-full border border-green-500 text-green-500 bg-green-200 mr-[5px]">
          <FaCheck />
        </button>
        <button
          type="button"
          className="w-[30px] h-[30px] flex justify-center items-center rounded-full border border-red-500 text-red-500 bg-red-200">
          <FaXmark />
        </button>
      </div>
    </div>
  );
}
