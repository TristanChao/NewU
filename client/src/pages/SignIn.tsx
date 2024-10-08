import React, { useState } from 'react';
import { BiLoaderCircle } from 'react-icons/bi';
import { Link, useNavigate } from 'react-router-dom';
import { useUser } from '../components/useUser';
import { signIn } from '../lib';
import { FaChevronLeft } from 'react-icons/fa';

export function SignIn() {
  const [usernameText, setUsernameText] = useState<string>();
  const [passText, setPassText] = useState<string>();
  const [isLoading, setIsLoading] = useState(false);
  const [isPassShown, setIsPassShown] = useState(false);
  const navigate = useNavigate();
  const { handleSignIn } = useUser();

  const inputStyle = 'border border-gray-400 rounded px-[5px] py-[3px]';

  // conditionally sets button color based on loading status
  // a visual indicator for the user that something is processing
  const buttonColor = isLoading ? '#DADADA' : '#D9FDFF';

  /**
   * Upon form submission, takes the form values and makes a fetch request.
   * The request will query for an existing user matching the
   * inputted credentials.
   */
  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    try {
      event.preventDefault();
      setIsLoading(true);

      if (!usernameText || !passText) {
        throw new Error('username and password are required fields');
      }

      const body = {
        username: usernameText,
        password: passText,
      };

      const { user, token } = await signIn(body);
      handleSignIn(user, token);
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
    <div className="px-[15px] small:px-[50px] big:px-[200px] max-w-[600px] big:max-w-[1000px]">
      <h1 className="text-[24px] my-3">Sign In</h1>
      <form onSubmit={handleSubmit} className="text-[18px]">
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
