import { Link } from 'react-router-dom';
import { useUser } from '../components/useUser';
import { useEffect } from 'react';

export function Home() {
  const { user, handleSignIn } = useUser();

  useEffect(() => {
    const localAuthJson = localStorage.getItem('um.auth');
    if (localAuthJson) {
      const localAuth = JSON.parse(localAuthJson);
      handleSignIn(localAuth.user, localAuth.token);
    }
  }, [handleSignIn]);

  async function onDemoClick() {
    const req = {
      body: JSON.stringify({
        username: 'demo',
        password: 'demoPassword987',
      }),
      headers: {
        'content-type': 'application/json',
      },
      method: 'post',
    };
    const res = await fetch('/api/auth/sign-in', req);
    if (!res.ok) throw new Error(`fetch Error: ${res.status}`);
    const { user, token } = await res.json();
    handleSignIn(user, token);
    console.log('signed in', user);
  }

  return (
    <div>
      {!user && (
        <div>
          <Link className="cursor-pointer" onClick={onDemoClick}>
            see the demo
          </Link>
        </div>
      )}
      {user && (
        <div className="px-[15px] pt-[20px]">
          <h1 className="text-[24px]">My Habit Calendars</h1>
        </div>
      )}
    </div>
  );
}
