import { createContext, ReactNode, useContext, useEffect, useState } from "react";

interface AuthUser {
  name: string;
  email: string;
  picture?: string;
}

interface AuthContextType {
  isAuthenticated: boolean;
  user: AuthUser | null;
  loginWithGoogle: (credential: string) => boolean;
  loginWithCredentials: (email: string, password: string) => boolean;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AUTH_STORAGE_KEY = "campus-connect-auth";
const AUTH_USER_STORAGE_KEY = "campus-connect-auth-user";
const DEMO_EMAIL = "admin@campusconnect.demo";
const DEMO_PASSWORD = "admin123";

const parseJwtPayload = (token: string) => {
  try {
    const base64Url = token.split(".")[1];
    if (!base64Url) {
      return null;
    }
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const payload = window.atob(base64);
    return JSON.parse(payload) as { name?: string; email?: string; picture?: string };
  } catch {
    return null;
  }
};

const getInitialAuthState = () => {
  if (typeof window === "undefined") {
    return false;
  }

  return window.localStorage.getItem(AUTH_STORAGE_KEY) === "true";
};

const getInitialUser = (): AuthUser | null => {
  if (typeof window === "undefined") {
    return null;
  }

  try {
    const savedUser = window.localStorage.getItem(AUTH_USER_STORAGE_KEY);
    if (!savedUser) {
      return null;
    }
    return JSON.parse(savedUser) as AuthUser;
  } catch {
    return null;
  }
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(getInitialAuthState);
  const [user, setUser] = useState<AuthUser | null>(getInitialUser);

  useEffect(() => {
    if (typeof window !== "undefined") {
      window.localStorage.setItem(AUTH_STORAGE_KEY, String(isAuthenticated));
    }
  }, [isAuthenticated]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      if (user) {
        window.localStorage.setItem(AUTH_USER_STORAGE_KEY, JSON.stringify(user));
      } else {
        window.localStorage.removeItem(AUTH_USER_STORAGE_KEY);
      }
    }
  }, [user]);

  const loginWithGoogle = (credential: string) => {
    if (!credential) {
      return false;
    }

    const payload = parseJwtPayload(credential);
    if (!payload?.email || !payload?.name) {
      return false;
    }

    setUser({
      name: payload.name,
      email: payload.email,
      picture: payload.picture,
    });
    setIsAuthenticated(true);
    return true;
  };

  const loginWithCredentials = (email: string, password: string) => {
    const normalizedEmail = email.trim().toLowerCase();
    const normalizedPassword = password.trim();

    if (normalizedEmail !== DEMO_EMAIL || normalizedPassword !== DEMO_PASSWORD) {
      return false;
    }

    setUser({
      name: "Demo Admin",
      email: DEMO_EMAIL,
    });
    setIsAuthenticated(true);
    return true;
  };

  const logout = () => {
    setIsAuthenticated(false);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, loginWithGoogle, loginWithCredentials, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};
