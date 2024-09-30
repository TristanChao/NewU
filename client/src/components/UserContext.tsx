import { ReactNode, createContext, useCallback, useState } from 'react';
import { removeAuth, saveAuth } from '../lib';

export type User = {
  userId: number;
  username: string;
  displayName: string;
};

export type UserContextValues = {
  user: User | undefined;
  token: string | undefined;
  handleSignIn: (user: User, token: string) => void;
  handleSignOut: () => void;
};
export const UserContext = createContext<UserContextValues>({
  user: undefined,
  token: undefined,
  handleSignIn: () => undefined,
  handleSignOut: () => undefined,
});

type Props = {
  children: ReactNode;
};
export function UserProvider({ children }: Props) {
  const [user, setUser] = useState<User>();
  const [token, setToken] = useState<string>();

  const handleSignIn = useCallback((user: User, token: string) => {
    setUser(user);
    setToken(token);
    saveAuth(user, token);
  }, []);

  const handleSignOut = useCallback(() => {
    setUser(undefined);
    setToken(undefined);
    removeAuth();
  }, []);

  const contextValue = { user, token, handleSignIn, handleSignOut };
  return (
    <UserContext.Provider value={contextValue}>{children}</UserContext.Provider>
  );
}
