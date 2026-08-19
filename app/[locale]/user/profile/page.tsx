import { Metadata } from "next";
import { SessionProvider } from "next-auth/react";

import { auth } from "@/auth";
import ProfileForm from "./profile-form";
import { getLocale } from "next-intl/server";
import { getLanguage } from "@/lib/utils";
import { Locale } from "@/types";

export const generateMetadata = async (): Promise<Metadata> => {
  const locale = await getLocale();
  const { currentLanguage } = getLanguage(locale as Locale);

  return {
    title: currentLanguage.Profile.title,
    description: currentLanguage.Profile.description,
  };
};

const ProfilePage = async () => {
  const locale = await getLocale();
  const session = await auth();
  const { currentLanguage } = getLanguage(locale as Locale);

  return (
    <SessionProvider session={session}>
      <div className="max-w-md mx-auto space-y-4">
        <h1 className="h2-bold">{currentLanguage.Profile.title}</h1>
        
        <ProfileForm />
      </div>
    </SessionProvider>
  );
};

export default ProfilePage;
