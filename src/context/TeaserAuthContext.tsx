import { createContext, useContext, useState, useEffect, ReactNode } from "react";

interface User {
  id: number;
  name: string;
  email: string;
}

interface TeaserAuthContextType {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
}

const TeaserAuthContext = createContext<TeaserAuthContextType | null>(null);

const AUTH_URL = "https://functions.poehali.dev/ce0989e9-330b-40b6-8baa-af130aae6978";

export function TeaserAuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(() => localStorage.getItem("teaser_token"));
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (token) {
      fetch(`${AUTH_URL}/me`, { headers: { "X-User-Id": token } })
        .then(r => r.json())
        .then(data => { if (data.id) setUser(data); })
        .catch(() => { localStorage.removeItem("teaser_token"); setToken(null); });
    }
  }, [token]);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const res = await fetch(`${AUTH_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Ошибка входа");
      localStorage.setItem("teaser_token", data.token);
      setToken(data.token);
      setUser({ id: data.user_id, name: data.name, email });
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (name: string, email: string, password: string) => {
    setIsLoading(true);
    try {
      const res = await fetch(`${AUTH_URL}/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Ошибка регистрации");
      localStorage.setItem("teaser_token", data.token);
      setToken(data.token);
      setUser({ id: data.user_id, name, email });
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem("teaser_token");
    setToken(null);
    setUser(null);
  };

  return (
    <TeaserAuthContext.Provider value={{ user, token, login, register, logout, isLoading }}>
      {children}
    </TeaserAuthContext.Provider>
  );
}

export function useTeaserAuth() {
  const ctx = useContext(TeaserAuthContext);
  if (!ctx) throw new Error("useTeaserAuth must be used within TeaserAuthProvider");
  return ctx;
}
