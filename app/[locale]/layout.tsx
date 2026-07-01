import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { notFound } from "next/navigation";

import { routing } from "@/i18n/routing";

export default async function RootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  const { locale } = await params;

  if (!routing.locales.includes(locale)) {
    notFound();
  }

  const messages = await getMessages();

  return (
    <NextIntlClientProvider messages={messages}>
      {children}
    </NextIntlClientProvider>
  );
}

// <html
//   lang={locale}
//   suppressHydrationWarning //* silences hydration mismatch warnings.
//   className={cn("h-full antialiased", inter.className)}
// >
//   <body className="min-h-full flex flex-col">
//     <NextIntlClientProvider messages={messages}>
//       <ThemeProvider
//         attribute="class"
//         defaultTheme="dark" //* This provider saves a "theme" value in localStorage.
//         disableTransitionOnChange
//       >
//         {children}

//         <Toaster position="bottom-right" />
//       </ThemeProvider>
//     </NextIntlClientProvider>
//   </body>
// </html>
