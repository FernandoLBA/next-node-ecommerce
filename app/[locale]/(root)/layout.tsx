import Footer from "@/components/footer";
import Header from "@/components/shared/header";

type RootLayoutProps = Readonly<{
  children: React.ReactNode;
}>;

export default async function RootLayout({ children }: RootLayoutProps) {
  return (
    <div className="flex h-screen flex-col">
      <Header />

      <main className="flex-1 pt-8! wrapper">{children}</main>

      <Footer />
    </div>
  );
}
