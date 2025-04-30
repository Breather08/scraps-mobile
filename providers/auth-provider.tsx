import React, { createContext, useContext, useEffect, useState } from "react";
import * as SecureStore from "expo-secure-store";

interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  // unix timestamp in ms
  expiresAt: number;
}

export interface AuthUser {
  id: string;
  phone: string;
}

interface AuthContextProps {
  user: AuthUser | null;
  loading: boolean;
  requestOtp: (phone: string) => Promise<void>;
  verifyOtp: (phone: string, otp: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextProps>({
  user: null,
  loading: true,
  requestOtp: async () => {},
  verifyOtp: async () => {},
  logout: async () => {},
});

export const useAuth = () => useContext(AuthContext);

async function saveTokens(tokens: AuthTokens) {
  await SecureStore.setItemAsync("access_token", tokens.accessToken);
  await SecureStore.setItemAsync("refresh_token", tokens.refreshToken);
  await SecureStore.setItemAsync("expires_at", String(tokens.expiresAt));
}

async function clearTokens() {
  await SecureStore.deleteItemAsync("access_token");
  await SecureStore.deleteItemAsync("refresh_token");
  await SecureStore.deleteItemAsync("expires_at");
}

async function getStoredTokens(): Promise<AuthTokens | null> {
  const accessToken = await SecureStore.getItemAsync("access_token");
  const refreshToken = await SecureStore.getItemAsync("refresh_token");
  const expiresAtStr = await SecureStore.getItemAsync("expires_at");
  if (!accessToken || !refreshToken || !expiresAtStr) return null;
  return { accessToken, refreshToken, expiresAt: Number(expiresAtStr) };
}

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  // Auto load session on mount
  useEffect(() => {
    (async () => {
      const tokens = await getStoredTokens();
      if (tokens) {
        // Ideally validate token expiry here
        if (Date.now() < tokens.expiresAt) {
          // fetch user profile using token or decode token
          const decoded: AuthUser = {
            id: "placeholder-id",
            phone: "" /* extract from jwt in real implementation */,
          };
          setUser(decoded);
        } else {
          // attempt refresh
          await refreshSession(tokens.refreshToken);
        }
      }
      setLoading(false);
    })();
  }, []);

  async function refreshSession(refreshToken: string) {
    try {
      // Call backend refresh endpoint
      const res = await new Promise<AuthTokens>((resolve) => {
        setTimeout(() => {
          resolve({
            accessToken: "new-access-token",
            refreshToken: "new-refresh-token",
            expiresAt: Date.now() + 3600 * 1000,
          });
        }, 250);
      });

      const tokens: AuthTokens = {
        accessToken: res.accessToken,
        refreshToken: res.refreshToken,
        expiresAt: res.expiresAt,
      };
      await saveTokens(tokens);
      setUser({
        id: "placeholder-id",
        phone: "",
      });
    } catch (e) {
      await clearTokens();
      setUser(null);
    }
  }

  const requestOtp = async (phone: string) => {
    return new Promise<void>((resolve) => {
      setTimeout(() => {
        resolve();
      }, 250);
    });
    // await fetch("https://api.example.com/auth/request-otp", {
    //   method: "POST",
    //   headers: { "Content-Type": "application/json" },
    //   body: JSON.stringify({ phone }),
    // });
  };

  const verifyOtp = async (phone: string, otp: string) => {
    const res = await new Promise<AuthTokens>((resolve) => {
      setTimeout(() => {
        resolve({
          accessToken: "new-access-token",
          refreshToken: "new-refresh-token",
          expiresAt: Date.now() + 3600 * 1000,
        });
      }, 250);
    });
    // const res = await fetch("https://api.example.com/auth/verify-otp", {
    //   method: "POST",
    //   headers: { "Content-Type": "application/json" },
    //   body: JSON.stringify({ phone, otp }),
    // });
    // if (!res.ok) {
    //   throw new Error("Invalid code");
    // }
    // const json = await res.json();
    const tokens: AuthTokens = {
      accessToken: res.accessToken,
      refreshToken: res.refreshToken,
      expiresAt: res.expiresAt,
    };
    await saveTokens(tokens);
    setUser({
      id: "placeholder-id",
      phone: "",
    });
  };

  const logout = async () => {
    await clearTokens();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, requestOtp, verifyOtp, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
