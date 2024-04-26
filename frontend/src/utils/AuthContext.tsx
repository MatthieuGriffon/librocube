import { createContext, useState, ReactNode, FC } from "react";

export interface AuthContextType {
  isAuthenticated: boolean;
  isEmailVerified: boolean;
  login: (token: string, userId: string, emailVerified: boolean) => void;
  logout: () => void;
  userId: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: FC<AuthProviderProps> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(
    !!localStorage.getItem("token")
  );
  const [isEmailVerified, setIsEmailVerified] = useState<boolean>(false);
  const [userId, setUserId] = useState<string>(
    localStorage.getItem("userId") || ""
  );

  const login = (token: string, userId: string, emailVerified: boolean) => {
    localStorage.setItem("token", token);
    localStorage.setItem("userId", userId);
    setIsAuthenticated(true);
    setIsEmailVerified(emailVerified);
    setUserId(userId);
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    setIsAuthenticated(false);
    setIsEmailVerified(false);
    setUserId("");
  };

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, isEmailVerified, userId, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};
export default AuthContext;
