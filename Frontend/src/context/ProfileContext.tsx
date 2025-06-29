import React, { createContext, useContext, useState } from "react";

type Profile = {
  name?: string;
  profileImage?: string;
  [key: string]: any;
};

type ProfileContextType = {
  profile: Profile | null;
  setProfile: React.Dispatch<React.SetStateAction<Profile | null>>;
  formData: Profile | null;
  setFormData: React.Dispatch<React.SetStateAction<Profile | null>>;
};

const ProfileContext = createContext<ProfileContextType | undefined>(undefined);

export const useProfile = () => {
  const ctx = useContext(ProfileContext);
  if (!ctx) throw new Error("useProfile must be used within ProfileProvider");
  return ctx;
};

export const ProfileProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [formData, setFormData] = useState<Profile | null>(null);
  return (
    <ProfileContext.Provider value={{ profile, setProfile, formData, setFormData }}>
      {children}
    </ProfileContext.Provider>
  );
};