"use client";

import { useTranslations } from "next-intl";
import { useSearchParams } from "next/navigation";
import { useActionState } from "react";
import { useFormStatus } from "react-dom";

import { AppButton } from "@/components/shared/app-button/app-button";
import { AppLink } from "@/components/shared/app-link/app-link";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import LoaderIcon from "@/components/ui/loader-icon";
import { useRouter } from "@/i18n/routing";
import { signInWithCredentials } from "@/lib/actions/user.actions";
import { appRoutes, signInDefaultValues } from "@/lib/constants";

const SignInButton = () => {
  const { pending } = useFormStatus();
  const t = useTranslations("SignIn");

  return (
    <AppButton
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
    </AppButton>
  );
};

export default function CredentialsSignInForm() {
  const router = useRouter();
  const [data, action] = useActionState(signInWithCredentials, {
    success: false,
    message: "",
  });
  const t = useTranslations("SignIn");
  const searchParams = useSearchParams();
  //* Extract the redirect URL from search parameters (e.g., /sign-in?callbackUrl=/cart)
  const callbackUrl = searchParams.get("callbackUrl") || appRoutes.HOME;

  return (
    <form action={action}>
      {/* //* Pass the callback URL as a hidden field so the Server Action knows where to redirect after success */}
      <input type="hidden" name="callbackUrl" value={callbackUrl} />
      <div className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="email">{t("email")}</Label>

          <Input
            id="email"
            type="email"
            name="email"
            required
            autoComplete="email"
            defaultValue={signInDefaultValues.email}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="password">{t("password")}</Label>

          <Input
            id="password"
            type="password"
            name="password"
            required
            autoComplete="password"
            defaultValue={signInDefaultValues.password}
          />
        </div>

        <div className="space-y-2">
          <SignInButton />

          <AppButton
            className="w-full"
            variant="outline"
            onClick={() => router.push(appRoutes.HOME)}
          >
            {t("cancelTextButton")}
          </AppButton>
        </div>

        {data && !data.success && (
          <div className="text-center text-destructive">{data.message}</div>
        )}

        <div className="text-sm text-center text-muted-foreground">
          {t("noAccountText")}{" "}
          <AppLink href={appRoutes.SIGN_UP} isUnderlined={true}>
            {t("signUpLinkText")}
          </AppLink>
        </div>
      </div>
    </form>
  );
}
