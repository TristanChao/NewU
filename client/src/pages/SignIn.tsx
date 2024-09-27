import React, { useState } from 'react';
import { BiLoaderCircle } from 'react-icons/bi';
import { User } from '../components/UserContext';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../components/useUser';

type AuthData = {
  user: User;
  token: string;
};

export function SignIn() {
  const [usernameText, setUsernameText] = useState<string>();
  const [passText, setPassText] = useState<string>();
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { handleSignIn } = useUser();

  const inputStyle = 'border border-gray-400 rounded px-[5px] py-[3px]';

  const buttonColor = isLoading ? '#DADADA' : '#D9FDFF';

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    try {
      event.preventDefault();
      setIsLoading(true);

      const req = {
        method: 'post',
        body: JSON.stringify({
          username: usernameText,
          password: passText,
        }),
        headers: {
          'content-type': 'application/json',
        },
      };
      const res = await fetch('/api/auth/sign-in', req);
      if (!res.ok) throw new Error(`fetch Error: ${res.status}`);
      const { user, token } = (await res.json()) as AuthData;
      handleSignIn(user, token);
      alert(`Signed in ${user.username}`);
      navigate('/');
    } catch (err) {
      console.error(err);
      alert(
        'Oops, something went wrong! Double check your username and password and try again.'
      );
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="mx-[15px]">
      <h1 className="text-[24px] my-3">Sign In</h1>
      <form onSubmit={handleSubmit}>
        <div className="flex flex-col space-y-2">
          <label>Username</label>
          <input
            required
            value={usernameText ? usernameText : ''}
            onChange={(e) => setUsernameText(e.target.value)}
            className={inputStyle}
          />
          <label>Password</label>
          <input
            required
            value={passText ? passText : ''}
            onChange={(e) => setPassText(e.target.value)}
            className={inputStyle}
            type="password"
          />
          <div className="flex justify-end pt-2">
            <button
              type="submit"
              className="w-[70px] h-[35px] rounded flex justify-center items-center"
              style={{ backgroundColor: buttonColor }}>
              {isLoading ? <BiLoaderCircle /> : 'Submit'}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
