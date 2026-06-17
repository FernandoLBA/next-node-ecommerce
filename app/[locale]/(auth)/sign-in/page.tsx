import { auth } from "@/auth";
import { Metadata } from "next";

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
import CredentialsSignInForm from "./credentials-signin-form";

export const metadata: Metadata = {
  title: "Sign In",
};

const SignInPage = async (props: {
  params: Promise<{ locale: string }>;

  searchParams: Promise<{
    callbackUrl: string;
  }>;
}) => {
  const { callbackUrl } = await props.searchParams;
  const { locale } = await props.params;
  const session = await auth();

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
          <CardTitle className="text-center">Sign In</CardTitle>
          <CardDescription className="text-center">
            Sign in to your account
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
