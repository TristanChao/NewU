import { TiThMenu } from 'react-icons/ti';
import { Link, Outlet } from 'react-router-dom';
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
        <div className="p-2 px-[15px] flex justify-between big:px-[50px] min-w-[300px]">
          <Link
            to="/"
            className="text-[32px] font-bold cursor-pointer"
            style={{ fontFamily: 'Arvo, serif' }}>
            NewU
          </Link>
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
        <div className="px-[15px] big:px-[50px] min-w-[300px]">
          <Outlet />
        </div>
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
