/*
  AuthContext.tsx
  ログイン認証用のContext
  全体のProviderとして使用する
  */
import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { login } from "./API";
import { Login } from "./types";

//login認証情報の保持などを行う

//Login処理用のContext
interface AuthContextProps {
  user: Login | null;  // Change User to Login
  loginUser: (id: number, password: string) => Promise<void>;
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
//Login処理用のProvider
export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<Login | null>(null); // Change User to Login

  //
  const loginUser = async (id: number, password: string): Promise<void> => {
    //ユーザ情報のチェック
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
