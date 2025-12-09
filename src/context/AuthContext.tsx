/* eslint-disable react-refresh/only-export-components */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { api } from "@/utils/api";

interface AuthContextType {
  user: any | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<any | null>(
    () => JSON.parse(localStorage.getItem("user") || "null")
  );
  const [token, setToken] = useState<string | null>(
    localStorage.getItem("token")
  );
  const [isLoading, setIsLoading] = useState(false);

  // Save user/token changes to localStorage
  useEffect(() => {
    if (token) localStorage.setItem("token", token);
    if (user) localStorage.setItem("user", JSON.stringify(user));
  }, [token, user]);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const res = await api.login({ email, password });

      // FIX: handle backend response structure
      const newToken = res.token || res.data?.token;
      const userData = res.user || res.data?.user;

      setToken(newToken);
      setUser(userData);
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (name: string, email: string, password: string) => {
    setIsLoading(true);
    try {
      const res = await api.register({ name, email, password });

      const newToken = res.token || res.data?.token;
      const userData = res.user || res.data?.user;

      setToken(newToken);
      setUser(userData);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, login, register, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};
