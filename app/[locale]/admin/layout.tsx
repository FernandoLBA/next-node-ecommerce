import { Metadata } from "next";
import Link from "next/link";

import { auth } from "@/auth";
import AdminSearch from "@/components/admin/admin-search";
import Menu from "@/components/shared/header/menu";
import AppImage from "@/components/ui/app-image";
import { redirect } from "@/i18n/routing";
import { getAppSettings } from "@/lib/actions/app-setting.actions";
import { APP_NAME, appRoutes, userRoles } from "@/lib/constants";
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
  const session = await auth();
  const { locale } = await params;

  if (!session) {
    redirect({ href: appRoutes.SIGN_IN, locale });
  }

  if (session?.user.role !== userRoles.ADMIN) {
    redirect({ href: appRoutes.HOME, locale });
  }

  return (
    <>
      <div className="flex flex-col">
        <div className="border-b container mx-auto">
          <div className="flex items-center h-16 px-4">
            <Link href={appRoutes.HOME} className="w-22">
              <AppImage
                src="/images/logo.svg"
                height={48}
                width={48}
                alt={APP_NAME}
              />
            </Link>

            <MainNav className="mx-6" />

            <div className="ml-auto flex items-center space-x-4">
              <AdminSearch />

              <Menu />
            </div>
          </div>
        </div>

        <div className="flex-1 space-y-4 p-8 pt-6 container mx-auto">
          {children}
        </div>
      </div>
    </>
  );
}
