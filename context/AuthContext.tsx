"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  clearSession,
  emailExists,
  findUser,
  getSessionEmail,
  getStoredUsers,
  saveSessionEmail,
  saveStoredUsers,
} from "@/lib/auth-storage";

type AuthContextValue = {
  userEmail: string | null;
  isAuthenticated: boolean;
  isReady: boolean;
  login: (email: string, password: string) => { ok: true } | { ok: false; error: string };
  register: (
    email: string,
    password: string,
  ) => { ok: true } | { ok: false; error: string };
  logout: () => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    setUserEmail(getSessionEmail());
    setIsReady(true);
  }, []);

  const login = useCallback((email: string, password: string) => {
    const user = findUser(email, password);
    if (!user) {
      return { ok: false as const, error: "Credenciales inválidas" };
    }
    saveSessionEmail(user.email);
    setUserEmail(user.email);
    return { ok: true as const };
  }, []);

  const register = useCallback((email: string, password: string) => {
    const trimmedEmail = email.trim();
    if (!trimmedEmail || !password) {
      return { ok: false as const, error: "Email y contraseña son requeridos" };
    }
    if (emailExists(trimmedEmail)) {
      return { ok: false as const, error: "El email ya está registrado" };
    }
    const users = getStoredUsers();
    users.push({ email: trimmedEmail, password });
    saveStoredUsers(users);
    saveSessionEmail(trimmedEmail);
    setUserEmail(trimmedEmail);
    return { ok: true as const };
  }, []);

  const logout = useCallback(() => {
    clearSession();
    setUserEmail(null);
  }, []);

  const value = useMemo(
    () => ({
      userEmail,
      isAuthenticated: Boolean(userEmail),
      isReady,
      login,
      register,
      logout,
    }),
    [userEmail, isReady, login, register, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth debe usarse dentro de AuthProvider");
  }
  return context;
}
