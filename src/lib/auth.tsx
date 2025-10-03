import React, { createContext, useContext, useEffect, useState } from "react";
import { api } from "./api";
import { User } from "./types";

interface AuthState {
  user: User | null;
  token: string | null;
  refreshToken: string | null;
  login(email: string, password: string): Promise<void>;
  logout(): void;
  refresh(): Promise<void>;
}

const AuthContext = createContext<AuthState>({
  user: null,
  token: null,
  refreshToken: null,
  async login() {},
  logout() {},
  async refresh() {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [refreshToken, setRefreshToken] = useState<string | null>(null);

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    const storedRefresh = localStorage.getItem("refreshToken");
    if (storedToken) setToken(storedToken);
    if (storedRefresh) setRefreshToken(storedRefresh);
    // 실제 서비스에서는 여기서 /auth/me 로 사용자 정보를 불러올 수 있습니다.
  }, []);

  const login = async (email: string, password: string) => {
    const res = await api.post<{ token: string; refreshToken: string; user: User }>(
      "/auth/login",
      { email, password },
    );
    setToken(res.token);
    setRefreshToken(res.refreshToken);
    setUser(res.user);
    localStorage.setItem("token", res.token);
    localStorage.setItem("refreshToken", res.refreshToken);
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    setRefreshToken(null);
    localStorage.removeItem("token");
    localStorage.removeItem("refreshToken");
  };

  const refresh = async () => {
    if (!refreshToken) return;
    const res = await api.post<{ token: string; refreshToken: string }>("/auth/refresh", {
      refreshToken,
    });
    setToken(res.token);
    setRefreshToken(res.refreshToken);
    localStorage.setItem("token", res.token);
    localStorage.setItem("refreshToken", res.refreshToken);
  };

  return (
    <AuthContext.Provider value={{ user, token, refreshToken, login, logout, refresh }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
