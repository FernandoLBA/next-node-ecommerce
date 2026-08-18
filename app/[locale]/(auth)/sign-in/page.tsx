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
import { APP_NAME, appRoutes } from "@/lib/constants";
import englishMessages from "@/messages/en.json";
import spanishMessages from "@/messages/es.json";
import CredentialsSignInForm from "./credentials-signin-form";

const locales: Record<string, typeof englishMessages> = {
  es: spanishMessages,
  en: englishMessages,
};

export const generateMetadata = async (): Promise<Metadata> => {
  const locale = await getLocale();
  const translation = locales[locale];

  return {
    title: translation.SignIn.title,
  };
};

const SignInPage = async (props: {
  searchParams: Promise<{
    callbackUrl: string;
  }>;
}) => {
  const { callbackUrl } = await props.searchParams;
  const locale = await getLocale();
  const session = await auth();
  const translation = locales[locale];

  //* If the user is already authenticated, redirect them to the callback URL to bypass the sign-in form.
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
              alt={`${APP_NAME} logo`}
              width={100}
              height={100}
            />
          </Link>
          <CardTitle className="text-center">
            {translation.SignIn.title}
          </CardTitle>
          <CardDescription className="text-center">
            {translation.SignIn.subTitle}
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          <CredentialsSignInForm />
        </CardContent>
      </Card>
    </div>
  );
};

export default SignInPage;
