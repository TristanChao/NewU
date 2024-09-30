import React, { useState } from 'react';
import { BiLoaderCircle } from 'react-icons/bi';
import { FaChevronLeft } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import { signUp } from '../lib';

export function Register() {
  const [usernameText, setUsernameText] = useState<string>();
  const [passText, setPassText] = useState<string>();
  const [displayNameText, setDisplayNameText] = useState<string>();
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const inputStyle = 'border border-gray-400 rounded px-[5px] py-[3px]';

  const buttonColor = isLoading ? '#DADADA' : '#D9FDFF';

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    try {
      event.preventDefault();
      setIsLoading(true);

      if (!usernameText || !passText) {
        throw new Error('username, password');
      }

      const body = {
        username: usernameText,
        password: passText,
        displayName: displayNameText,
      };
      const newUser = await signUp(body);
      alert(`Registered ${newUser.username}`);
      navigate('/sign-in');
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <>
      <h1 className="text-[24px] my-3">Register</h1>
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
          <label>Display Name &#40;optional&#41;</label>
          <input
            placeholder={usernameText}
            value={displayNameText ? displayNameText : ''}
            onChange={(e) => setDisplayNameText(e.target.value)}
            className={inputStyle}
          />
          <div className="flex justify-between pt-2">
            <Link to="/" className="flex justify-center items-center">
              <FaChevronLeft />
              Back
            </Link>
            <button
              type="submit"
              className="w-[70px] h-[35px] rounded flex justify-center items-center"
              style={{ backgroundColor: buttonColor }}>
              {isLoading ? (
                <div className="spin">
                  <BiLoaderCircle />
                </div>
              ) : (
                'Submit'
              )}
            </button>
          </div>
        </div>
      </form>
    </>
  );
}
