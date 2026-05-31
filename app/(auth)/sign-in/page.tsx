import { auth } from "@/auth";
import { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";

import AppImage from "@/components/ui/app-image";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { APP_NAME } from "@/lib/constants";
import CredentialsSignInForm from "./credentials-signin-form";

export const metadata: Metadata = {
  title: "Sign In",
};

const SignInPage = async (props: {
  searchParams: Promise<{
    callbackUrl: string;
  }>;
}) => {
  const { callbackUrl } = await props.searchParams;
  const session = await auth();

  if (session) {
    return redirect(callbackUrl || "/");
  }

  return (
    <div className="w-full max-w-md mx-auto">
      <Card>
        <CardHeader className="space-y-4">
          <Link href="/" className="flex-center">
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
          <CardContent className="space-y-4">
            <CredentialsSignInForm />
          </CardContent>
        </CardHeader>
      </Card>
    </div>
  );
};

export default SignInPage;
