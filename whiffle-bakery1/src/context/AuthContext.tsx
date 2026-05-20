import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { api, type BackendUser, type LoginResponse } from "@/lib/api";

type AuthContextType = {
  user: BackendUser | null;
  loading: boolean;
  login: (email: string, password: string, rememberMe?: boolean) => Promise<LoginResponse>;
  signup: (email: string, username: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
  setUser: (user: BackendUser | null) => void;
  isAuthenticated: boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<BackendUser | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshUser = async () => {
    try {
      const me = await api.getMe();
      setUser(me);
    } catch {
      setUser(null);
    }
  };

  useEffect(() => {
    const boot = async () => {
      await refreshUser();
      setLoading(false);
    };
    void boot();
  }, []);

  const login = async (email: string, password: string, rememberMe?: boolean) => {
    const res = await api.login({ email, password, remember_me: rememberMe });
    if (!res.two_factor_required) {
      if (res.user) {
        setUser(res.user);
      } else {
        await refreshUser();
      }
    }
    return res;
  };

  const signup = async (email: string, username: string, password: string) => {
    await api.signup({ email, username, password });
  };

  const logout = async () => {
    await api.logout();
    setUser(null);
  };

  const value = useMemo(
    () => ({
      user,
      loading,
      login,
      signup,
      logout,
      refreshUser,
      setUser,
      isAuthenticated: !!user,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [user, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};
