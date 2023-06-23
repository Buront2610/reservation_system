import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { login } from "./API";
import { Login } from "./types";
import { useNavigate } from "react-router-dom";

interface AuthContextProps {
  user: Login | null; 
  loginUser: (id: string, password: string) => Promise<void>;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextProps | null>(null);

export const UseAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

interface AuthProviderProps {
  children: ReactNode;
}
export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  // const navigate = useNavigate();
  const [user, setUser] = useState<Login | null>(() => {
    const userFromLocalStorage = localStorage.getItem('user');
    const loginTimeStamp = localStorage.getItem('loginTimeStamp');

    if (userFromLocalStorage && loginTimeStamp) {
      const currentTimeStamp = new Date().getTime();
      const timeDifference = currentTimeStamp - Number(loginTimeStamp);

      // 24 hours in milliseconds is 24 * 60 * 60 * 1000
      if (timeDifference < 1 * 60 * 60 * 1000) {
        return JSON.parse(userFromLocalStorage);
      } else {
        // If more than 24 hours has passed, remove user and timestamp from local storage
        localStorage.removeItem('user');
        localStorage.removeItem('loginTimeStamp');
        return null;
      }
    } else {
      return null;
    }
  });

  const loginUser = async (id: string, password: string): Promise<void> => {
    const foundUser = await login(id, password);

    if (foundUser) {
      setUser(foundUser);
      localStorage.setItem('user', JSON.stringify(foundUser));
      localStorage.setItem('loginTimeStamp', JSON.stringify(new Date().getTime()));
    } else {
      throw new Error('IDまたはパスワードが違います。');
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
    localStorage.removeItem('loginTimeStamp');
    // navigate("login");
  };

  return (
    <AuthContext.Provider value={{ user, loginUser, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
