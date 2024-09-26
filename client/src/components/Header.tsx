import { useEffect, useState } from 'react';
import { TiThMenu } from 'react-icons/ti';
import { Outlet } from 'react-router-dom';

export function Header() {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<unknown>();

  useEffect(() => {
    // this function will check the db for the 'demo' user
    // if it doesn't exist, it will create the demo account
    // this is to ensure that a demo account is always accessible
    async function verifyDemo(): Promise<void> {
      try {
        const res = await fetch('/api/users/demo');
        if (!res.ok) throw new Error(`fetch Error ${res.status}`);
        const demoExistsObj = await res.json();

        if (demoExistsObj.demoExists) {
          return;
        }

        const req = {
          headers: {
            'content-type': 'application/json',
          },
          method: 'post',
          body: JSON.stringify({
            username: 'demo',
            password: 'demoPassword987',
          }),
        };
        const response = await fetch('/api/auth/sign-up', req);
        if (!response.ok) throw new Error(`fetch Error ${response.status}`);
      } catch (err) {
        console.error(err);
        setError(err);
      } finally {
        setIsLoading(false);
      }
    }

    verifyDemo();
  }, []);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return (
      <p>Error: {error instanceof Error ? error.message : 'Unknown Error'}</p>
    );
  }

  return (
    <div>
      <div className="p-2 px-[15px] flex justify-between">
        <h1 className="text-[32px] font-bold">NewU</h1>
        <button className="text-[32px]">
          <TiThMenu />
        </button>
      </div>
      <hr className="border-[1px]" />
      <Outlet />
    </div>
  );
}
