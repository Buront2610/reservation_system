import React, { createContext, useContext, useState, ReactNode } from "react";
import { login } from "./API";
import { Login } from "./types";
// import { useNavigate } from "react-router-dom"; // Uncomment this if you need navigation

interface AuthContextProps {
  user: Login | null; 
  loginUser: (id: string, password: string) => Promise<Login | null>;
  logout: () => void;
  isInitialSetup: boolean;
  updateInitialSetupState: (value: boolean) => void;
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
  // const navigate = useNavigate(); // Uncomment this if you need navigation
  
  const [isInitialSetup, setIsInitialSetup] = useState<boolean>(false);
  const [user, setUser] = useState<Login | null>(() => {
    const userFromLocalStorage = localStorage.getItem('user');
    const loginTimeStamp = localStorage.getItem('loginTimeStamp');

    if (userFromLocalStorage && loginTimeStamp) {
      const currentTimeStamp = new Date().getTime();
      const timeDifference = currentTimeStamp - Number(loginTimeStamp);

      // 24 hours in milliseconds is 24 * 60 * 60 * 1000
      if (timeDifference < 24 * 60 * 60 * 1000) {
        return JSON.parse(userFromLocalStorage);
      } else {
        localStorage.removeItem('user');
        localStorage.removeItem('loginTimeStamp');
        return null;
      }
    } else {
      return null;
    }
  });

  const loginUser = async (id: string, password: string): Promise<Login | null> => {
    if (id !== "" && password !== "") {
      const foundUser = await login(id, password);
      if (foundUser) {
        setUser(foundUser);
        localStorage.setItem('user', JSON.stringify(foundUser));
        localStorage.setItem('loginTimeStamp', JSON.stringify(new Date().getTime()));
        return foundUser;
      } else {
        alert("IDまたはパスワードが違います。");
        return null;
      }
    }
    return null;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
    localStorage.removeItem('loginTimeStamp');
    // navigate("login"); // Uncomment this if you need navigation
  };

  const updateInitialSetupState = (value: boolean) => {
    setIsInitialSetup(value);
  };

  const contextValue = {
    user,
    loginUser,
    logout,
    isInitialSetup,
    updateInitialSetupState,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};
