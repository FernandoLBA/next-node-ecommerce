import { Metadata } from "next";
import { getLocale } from "next-intl/server";

import { auth } from "@/auth";
import AppImage from "@/components/ui/app-image";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Link, redirect } from "@/i18n/routing";
import { getAppSettings } from "@/lib/actions/app-setting.actions";
import { appRoutes } from "@/lib/constants";
import { getLanguage } from "@/lib/utils";
import { Locale } from "@/types";
import CredentialsSignUpForm from "./sign-up-form";

// export const metadata: Metadata = {
//   title: "Sign Up",
// };

export const generateMetadata = async (): Promise<Metadata> => {
  const locale = await getLocale();
  const { currentLanguage } = getLanguage(locale as Locale);

  return { title: currentLanguage.SignUp.title };
};

const SignUpPage = async (props: {
  searchParams: Promise<{
    callbackUrl: string;
  }>;
}) => {
  const locale = await getLocale();
  const { callbackUrl } = await props.searchParams;
  const session = await auth();
  const settings = await getAppSettings();
  const { currentLanguage } = getLanguage(locale as Locale);

  //? If the user is authenticated, it's redirected to previous visited page
  if (session) {
    return redirect({ href: callbackUrl || appRoutes.HOME, locale });
  }

  return (
    <div className="w-full max-w-md mx-auto">
      <Card>
        <CardHeader className="space-y-4">
          <Link href={appRoutes.HOME} className="flex-center">
            <AppImage
              src="/images/logo.svg"
              alt={`${settings.appName} logo`}
              width={100}
              height={100}
            />
          </Link>

          <CardTitle className="text-center">
            {currentLanguage.SignUp.title}
          </CardTitle>

          <CardDescription className="text-center">
            {currentLanguage.SignUp.subTitle}
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          <CredentialsSignUpForm />
        </CardContent>
      </Card>
    </div>
  );
};

export default SignUpPage;
