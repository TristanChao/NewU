import { Link } from 'react-router-dom';
import { useUser } from '../components/useUser';
import { useEffect, useState } from 'react';

export function Home() {
  const { user, handleSignIn } = useUser();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<unknown>();

  useEffect(() => {
    const localAuthJson = localStorage.getItem('um.auth');
    if (localAuthJson) {
      const localAuth = JSON.parse(localAuthJson);
      handleSignIn(localAuth.user, localAuth.token);
    }
  }, [handleSignIn]);

  async function onDemoClick() {
    try {
      setIsLoading(true);
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
    } catch (err) {
      console.error(err);
      setError(err);
    } finally {
      setIsLoading(false);
    }
  }

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return (
      <div>
        Error! {error instanceof Error ? error.message : 'Unknown error'}
      </div>
    );
  }

  const buttonLayout =
    'py-[5px] px-[10px] rounded bg-[#B9FBFF] cursor-pointer text-xl';

  return (
    <div className="mx-[15px]">
      {!user && (
        <div className="mt-[30vh] flex justify-center">
          <div className="flex flex-col items-center">
            <p className="text-3xl mb-4">Welcome to NewU!</p>
            <div className="space-x-5 mb-2">
              <Link to="/register" className={buttonLayout}>
                Register
              </Link>
              <Link to="/sign-in" className={buttonLayout}>
                Sign In
              </Link>
            </div>
            <span className="text-lg">or</span>
            <a
              className="cursor-pointer mt-0 text-gray-600 underline text-lg"
              onClick={onDemoClick}>
              see the demo
            </a>
          </div>
        </div>
      )}
      {user && (
        <div className="pt-[20px]">
          <h1 className="text-[24px]">My Habit Calendars</h1>
        </div>
      )}
    </div>
  );
}
