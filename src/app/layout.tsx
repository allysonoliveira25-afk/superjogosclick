import type { Metadata } from "next";
import { Baloo_2, Nunito } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/lib/auth-context";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { getAllCategories } from "@/lib/categories";
import type { Category } from "@/lib/types";

const baloo = Baloo_2({ variable: "--font-baloo", subsets: ["latin"], weight: ["600", "700", "800"] });
const nunito = Nunito({ variable: "--font-nunito", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "SuperJogosClick — Jogos online grátis",
  description:
    "Jogue centenas de jogos online grátis no navegador: ação, aventura, puzzle, corrida e muito mais, com classificação indicativa em cada jogo.",
};

async function safeGetCategories(): Promise<Category[]> {
  try {
    return await getAllCategories();
  } catch {
    return [];
  }
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const categories = await safeGetCategories();

  return (
    <html lang="pt-BR" className={`${baloo.variable} ${nunito.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col bg-background text-foreground">
        <AuthProvider>
          <Header categories={categories} />
          <main className="flex-1">{children}</main>
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}
