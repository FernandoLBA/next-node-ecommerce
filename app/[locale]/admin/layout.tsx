import { Metadata } from "next";

import { auth } from "@/auth";
import AdminSearch from "@/components/admin/admin-search";
import { AppLink } from "@/components/shared/app-link/app-link";
import Menu from "@/components/shared/header/menu";
import AppImage from "@/components/ui/app-image";
import { redirect } from "@/i18n/routing";
import { getAppSettings } from "@/lib/actions/app-setting.actions";
import { appRoutes, userRoles } from "@/lib/constants";
import MainNav from "./main-nav";

export const generateMetadata = async (): Promise<Metadata> => {
  const settings = await getAppSettings();

  return {
    title: {
      template: `%s | ${settings.appName}`,
      default: settings.appName,
    },
  };
};

type AdminLayoutProps = Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>;

export default async function AdminLayout({
  children,
  params,
}: AdminLayoutProps) {
  const settings = await getAppSettings();
  const session = await auth();
  const { locale } = await params;

  if (!session) {
    redirect({ href: appRoutes.SIGN_IN, locale });
  }

  if (session?.user.role !== userRoles.ADMIN) {
    redirect({ href: appRoutes.HOME, locale });
  }

  return (
    <div className="flex h-screen flex-col">
      <div className="border-b">
        <div className="wrapper flex-between h-16 gap-4">
          <div className="flex-start gap-6">
            <AppLink href={appRoutes.HOME} className="flex-start">
              <AppImage
                src={`${appRoutes.IMAGES}/logo.svg`}
                height={32}
                width={32}
                alt={settings.appName}
              />
            </AppLink>

            <MainNav />
          </div>

          <div className="flex-center gap-4">
            <AdminSearch />

            <Menu />
          </div>
        </div>
      </div>

      <main className="wrapper flex-1 space-y-4 py-6">{children}</main>
    </div>
  );
}
