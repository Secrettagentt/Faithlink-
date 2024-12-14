// Context/CurrentUserContext.tsx
"use client";
import { useGetUser } from "@/api/user";
import { localStorageGetItem } from "@/utils/storage-available";
import { useRouter } from "next/navigation";
import React, { createContext, useContext, useEffect, useState } from "react";

type User = {
  id: string;
  name: string;
  email: string;
  role: string;
  // Add other user properties as needed
};

type CurrentUserContextType = {
  user: User | null;
  loading: boolean;
  refetchUser: () => Promise<void>;
};

const CurrentUserContext = createContext<CurrentUserContextType | undefined>(
  undefined
);

export const CurrentUserProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const router = useRouter();

  const token = localStorageGetItem("token");

  const { profileData, profileLoading, profileRefetch } = useGetUser();

  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    if (!profileLoading && !profileData) {
      const allowedRoutes = ["/login", "/signup", "/"];
      if (!allowedRoutes.includes(window.location.pathname)) {
        router.push("/");
      }
    }
  }, [profileData, profileLoading, router]);

  useEffect(() => {
    if (profileData) {
      setCurrentUser(profileData);
    }
  }, [profileData]);

  useEffect(() => {
    if (token) {
      profileRefetch();
    }
  }, [token]);

  const refetchUser = async () => {
    await profileRefetch();
  };

  return (
    <CurrentUserContext.Provider
      value={{
        user: currentUser,
        loading: profileLoading,
        refetchUser,
      }}
    >
      {children}
    </CurrentUserContext.Provider>
  );
};

export const useCurrentUser = (): CurrentUserContextType => {
  const context = useContext(CurrentUserContext);
  if (!context) {
    throw new Error("useCurrentUser must be used within a CurrentUserProvider");
  }
  return context;
};
