import type { Metadata } from "next";
import { Baloo_2, Nunito } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/lib/auth-context";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import MaintenanceGate from "@/components/MaintenanceGate";
import { getAllCategories } from "@/lib/categories";
import { getSiteSettings } from "@/lib/settings";
import { getAllPages } from "@/lib/pages";
import { DEFAULT_SITE_SETTINGS, type Category, type CustomPage, type SiteSettings } from "@/lib/types";

const baloo = Baloo_2({ variable: "--font-baloo", subsets: ["latin"], weight: ["600", "700", "800"] });
const nunito = Nunito({ variable: "--font-nunito", subsets: ["latin"] });

async function safe<T>(promise: Promise<T>, fallback: T): Promise<T> {
  try {
    return await promise;
  } catch {
    return fallback;
  }
}

export async function generateMetadata(): Promise<Metadata> {
  const settings = await safe(getSiteSettings(), DEFAULT_SITE_SETTINGS);
  return {
    title: `${settings.siteName} — Jogos online grátis`,
    description: settings.description,
  };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [categories, settings, pages] = await Promise.all([
    safe<Category[]>(getAllCategories(), []),
    safe<SiteSettings>(getSiteSettings(), DEFAULT_SITE_SETTINGS),
    safe<CustomPage[]>(getAllPages(), []),
  ]);

  return (
    <html lang="pt-BR" className={`${baloo.variable} ${nunito.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col bg-background text-foreground">
        <AuthProvider>
          <Header categories={categories} siteName={settings.siteName} />
          <main className="flex-1">
            <MaintenanceGate settings={settings}>{children}</MaintenanceGate>
          </main>
          <Footer settings={settings} pages={pages.filter((p) => p.showInFooter)} />
        </AuthProvider>
      </body>
    </html>
  );
}
