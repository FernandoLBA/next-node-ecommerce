import { Metadata } from "next";

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
import CredentialsSignUpForm from "./sign-up-form";

export const metadata: Metadata = {
  title: "Sign Up",
};

const SignUpPage = async (props: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{
    callbackUrl: string;
  }>;
}) => {
  const { locale } = await props.params;
  const { callbackUrl } = await props.searchParams;
  const session = await auth();

  //* Si el usuario ya está autenticado, lo redirigimos automáticamente a la pagina donde estubo antes o al home, para que no vea el formulario de login.
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

          <CardTitle className="text-center">Create Account</CardTitle>
          
          <CardDescription className="text-center">
            Enter your information below to sign up
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
