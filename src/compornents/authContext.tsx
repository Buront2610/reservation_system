import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { login } from "./api";
import { Login } from "./types";


interface AuthContextProps {
  user: Login | null;  // Change User to Login
  loginUser: (id: number, password: string) => Promise<void>;
  logout: () => void;
}


export const AuthContext = createContext<AuthContextProps | null>(null);

export const useAuth = () => {
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
  const [user, setUser] = useState<Login | null>(null); // Change User to Login

  const loginUser = async (id: number, password: string): Promise<void> => {
    const foundUser = await login(id, password);
  
    if (foundUser) {
      setUser(foundUser);
      localStorage.setItem('user', JSON.stringify(foundUser));
    } else {
      throw new Error('IDまたはパスワードが違います。');
    }
  };
  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider value={{ user, loginUser, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
