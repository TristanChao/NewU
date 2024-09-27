import { TiThMenu } from 'react-icons/ti';
import { Outlet } from 'react-router-dom';
import { useUser } from './useUser';
import { Popup } from './Popup';
import { useRef, useState } from 'react';

export function Header() {
  const { user, handleSignOut } = useUser();
  const [menuIsOpen, setMenuIsOpen] = useState(false);
  const menuBtnRef = useRef<HTMLButtonElement>(null);

  function handleLogoutClick() {
    handleSignOut();
    setMenuIsOpen(false);
  }

  return (
    <>
      <div>
        <div className="p-2 px-[15px] flex justify-between">
          <h1 className="text-[32px] font-bold">NewU</h1>
          {user && (
            <div className="flex items-center">
              <h1 className="h-fit mr-[20px] text-lg inline-block">
                {user?.displayName}
              </h1>
              <button
                type="button"
                ref={menuBtnRef}
                className="text-[32px]"
                onClick={() => setMenuIsOpen(true)}>
                <TiThMenu />
              </button>
            </div>
          )}
        </div>
        <hr className="border-[1px]" />
        <Outlet />
      </div>
      <Popup
        isOpen={menuIsOpen}
        popupAccessRef={menuBtnRef}
        onShadeClick={() => setMenuIsOpen(false)}>
        <ul>
          <li>
            <a className="cursor-pointer" onClick={handleLogoutClick}>
              Log Out
            </a>
          </li>
        </ul>
      </Popup>
    </>
  );
}
