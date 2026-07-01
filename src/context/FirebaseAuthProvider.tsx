"use client";

import React, { createContext, useContext, useState } from "react";

type Profile = {
  id: string;
  name: string | null;
  email: string;
  role: "CUSTOMER" | "PROVIDER" | "ADMIN";
  phoneNumber: string | null;
  avatarUrl: string | null;
  address: string | null;
  rating: number | null;
};

type AuthContextType = {
  user: any;
  profile: Profile | null;
  isLoading: boolean;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType>({
  user: null as any,
  profile: null,
  isLoading: false,
  signOut: async () => {},
  refreshProfile: async () => {},
});

export function FirebaseAuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [profile] = useState<Profile | null>(null);

  return (
    <AuthContext.Provider
      value={{ user: null as any, profile, isLoading: false, signOut: async () => {}, refreshProfile: async () => {} }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useFirebaseAuth = () => useContext(AuthContext);
