import { TiThMenu } from 'react-icons/ti';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import { useUser } from './useUser';
import { Popup } from './Popup';
import { useEffect, useRef, useState } from 'react';
import { readToken, readUser } from '../lib';

export function Header() {
  const { user, handleSignOut, handleSignIn } = useUser();
  const [menuIsOpen, setMenuIsOpen] = useState(false);
  const menuBtnRef = useRef<HTMLButtonElement>(null);
  const navigate = useNavigate();

  // when logout is clicked, signs user out and closes menu
  function handleLogoutClick() {
    handleSignOut();
    setMenuIsOpen(false);
    navigate('/');
  }

  // effect which signs in user if their auth data is in local storage
  useEffect(() => {
    const localUser = readUser();
    const localToken = readToken();
    if (localUser && localToken) {
      handleSignIn(localUser, localToken);
    }
  }, [handleSignIn]);

  return (
    <>
      <div>
        <div className="p-2 px-[15px] flex justify-between small:px-[50px] min-w-[350px]">
          {/* "NewU" link that goes to home page */}
          <Link
            to="/"
            className="text-[32px] font-bold cursor-pointer"
            style={{ fontFamily: 'Arvo, serif' }}>
            NewU
          </Link>
          {/* user's display name and menu icon, showing when
           a user is logged in */}
          {user && (
            <div className="flex items-center">
              <h1 className="h-fit mr-[20px] text-lg inline-block">
                {user.displayName}
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
        {/* page outlet */}
        <div className="min-w-[350px]">
          <Outlet />
        </div>
      </div>
      {/* menu popup */}
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
