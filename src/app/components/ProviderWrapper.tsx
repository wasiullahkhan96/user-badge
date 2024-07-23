// components/SessionProviderWrapper.tsx
"use client";

import { User } from "@prisma/client";
import { SessionProvider } from "next-auth/react";
import {
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction,
  useContext,
  useState,
} from "react";

interface SessionProviderWrapperProps {
  children: ReactNode;
}
interface UserContextType {
  user: User | null;
  setUser: any;
}

const ProviderWrapper = ({ children }: SessionProviderWrapperProps) => {
  return (
    <SessionProvider>
      <UserProvider>{children}</UserProvider>
    </SessionProvider>
  );
};
export default ProviderWrapper;

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = (): UserContextType => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};
