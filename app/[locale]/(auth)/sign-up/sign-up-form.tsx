"use client";

import { useTranslations } from "next-intl";
import { useSearchParams } from "next/navigation";
import { useActionState } from "react";
import { useFormStatus } from "react-dom";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import LoaderIcon from "@/components/ui/loader-icon";
import { Link } from "@/i18n/routing";
import { signUpUser } from "@/lib/actions/user.actions";
import { appRoutes, signUpDefaultValues } from "@/lib/constants";

const SignUpButton = () => {
  const t = useTranslations("SignUp");
  const { pending } = useFormStatus();

  return (
    <Button
      type="submit"
      disabled={pending}
      className="w-full"
      variant="default"
    >
      {pending ? (
        <>
          <LoaderIcon />
          {t("loadingTextButton")}
        </>
      ) : (
        <>{t("textButton")}</>
      )}
    </Button>
  );
};

export default function CredentialsSignUpForm() {
  const t = useTranslations("SignUp");
  const [data, action] = useActionState(signUpUser, {
    success: false,
    message: "",
  });

  const searchParams = useSearchParams();
  //* Get the redirect URL from search parameters (e.g. /sign-in?callbackUrl=/cart)
  const callbackUrl = searchParams.get("callbackUrl") || appRoutes.HOME;

  return (
    <form action={action}>
      {/* //* Send the redirect URL as a hidden field so the Server Action knows where to redirect after success */}
      <input type="hidden" name="callbackUrl" value={callbackUrl} />
      <div className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="name">{t("name")}</Label>
          <Input
            id="name"
            type="name"
            name="name"
            autoComplete="name"
            defaultValue={signUpDefaultValues.name}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">{t("email")}</Label>
          <Input
            id="email"
            type="text"
            name="email"
            autoComplete="email"
            defaultValue={signUpDefaultValues.email}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="password">{t("password")}</Label>
          <Input
            id="password"
            type="password"
            name="password"
            autoComplete="password"
            defaultValue={signUpDefaultValues.password}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="confirmPassword">{t("confirmPassword")}</Label>
          <Input
            id="confirmPassword"
            type="password"
            name="confirmPassword"
            autoComplete="confirmPassword"
            defaultValue={signUpDefaultValues.confirmPassword}
          />
        </div>

        <div>
          <SignUpButton />
        </div>

        {data && !data.success && (
          <div className="text-center text-destructive">{data.message}</div>
        )}

        <div className="text-sm text-center text-muted-foreground">
          {t("haveAccountText")}{" "}
          <Link href={appRoutes.SIGN_IN} target="_self" className="link">
            {t("signInLinkText")}
          </Link>
        </div>
      </div>
    </form>
  );
}
