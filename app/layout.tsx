import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Toaster } from "sonner";

import "@/assets/styles/globals.css";
import { APP_DESCRIPTION, APP_NAME, APP_SERVER_URL } from "@/lib/constants";
import { ThemeProvider } from "@/lib/providers";
import { cn } from "@/lib/utils";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    template: `%s | Prostore`,
    default: `${APP_NAME}`,
  },
  description: APP_DESCRIPTION,
  metadataBase: new URL(APP_SERVER_URL),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning // ? silencia las advertencias de desajuste (mismatch) durante la hidratación.
      className={cn("h-full antialiased", inter.className)}
    >
      <body className="min-h-full flex flex-col">
        <ThemeProvider
          attribute="class"
          defaultTheme="dark" // ? Este provider guarda un valor "theme" en el localStorage.
          disableTransitionOnChange
        >
          {children}
          
          <Toaster position="bottom-right" />
        </ThemeProvider>
      </body>
    </html>
  );
}
