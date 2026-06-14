"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged, User, signInWithPopup, GoogleAuthProvider, signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  loginWithGoogle: () => Promise<void>;
  mockLogin: () => void;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  loginWithGoogle: async () => {},
  mockLogin: () => {},
  logout: async () => {},
});

export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // If auth is not initialized properly (mock fallback) it might fail
    try {
      const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
        setUser(currentUser);
        setLoading(false);
      });
      return () => unsubscribe();
    } catch (e) {
      console.warn("Firebase Auth not fully configured", e);
      setTimeout(() => {
        setLoading(false);
      }, 0);
    }
  }, []);

  const loginWithGoogle = async () => {
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error("Google login failed", error);
    }
  };

  const mockLogin = () => {
    // A fake user object for testing before Firebase is linked
    setUser({
      uid: "mock123",
      displayName: "Mock User",
      email: "mock@example.com",
      photoURL: "https://i.pravatar.cc/150?u=mock123",
    } as User);
  };

  const logout = async () => {
    try {
      if (user?.uid === "mock123") {
        setUser(null);
        return;
      }
      await signOut(auth);
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, loginWithGoogle, mockLogin, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
