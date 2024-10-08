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
  const [isPassShown, setIsPassShown] = useState(false);
  const navigate = useNavigate();

  const inputStyle = 'border border-gray-400 rounded px-[5px] py-[3px]';

  const buttonColor = isLoading ? '#DADADA' : '#D9FDFF';

  /**
   * Upon form submission, takes the form values and makes a fetch request.
   * The request will create a new user in the database.
   */
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
      await signUp(body);
      navigate('/sign-in');
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="px-[15px] small:px-[50px] big:px-[200px] max-w-[700px] big:max-w-[1100px]">
      <h1 className="text-[24px] mt-7 mb-3">Register</h1>
      <form onSubmit={handleSubmit} className="text-[18px]">
        <div className="flex flex-col space-y-2">
          <label htmlFor="reg-user-input">Username</label>
          <input
            required
            id="reg-user-input"
            value={usernameText ? usernameText : ''}
            onChange={(e) => setUsernameText(e.target.value)}
            className={inputStyle}
          />
          <label htmlFor="reg-pass-input">Password</label>
          <input
            required
            id="reg-pass-input"
            value={passText ? passText : ''}
            onChange={(e) => setPassText(e.target.value)}
            className={inputStyle}
            type={isPassShown ? 'text' : 'password'}
          />
          <div>
            <label>
              <input
                onClick={() => setIsPassShown(!isPassShown)}
                type="checkbox"
                className="mr-[5px]"
              />
              Show Password
            </label>
          </div>
          <label htmlFor="reg-disp-input">
            Display Name &#40;optional&#41;
          </label>
          <input
            id="reg-disp-input"
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
                <div className="animate-spin-slow">
                  <BiLoaderCircle />
                </div>
              ) : (
                'Submit'
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
