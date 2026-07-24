"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import { useAuth } from "@/lib/auth-context";

const NAV = [
  { href: "/admin", label: "📊 Dashboard", exact: true },
  { href: "/admin/jogos", label: "🎮 Jogos" },
  { href: "/admin/categorias", label: "🗂️ Categorias" },
  { href: "/admin/usuarios", label: "👥 Usuários" },
  { href: "/admin/importar", label: "📥 Importar" },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, profile, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (loading) return;
    if (!user) {
      router.push("/login");
      return;
    }
    if (profile && profile.role !== "admin") {
      router.push("/");
    }
  }, [loading, user, profile, router]);

  if (loading || !profile || profile.role !== "admin") {
    return (
      <div className="flex min-h-[60vh] items-center justify-center text-muted">
        Verificando permissões de administrador...
      </div>
    );
  }

  return (
    <div className="mx-auto flex max-w-[1400px] gap-6 px-4 py-6">
      <aside className="w-52 shrink-0">
        <nav className="sticky top-20 flex flex-col gap-1 rounded-2xl bg-surface p-3 shadow">
          {NAV.map((item) => {
            const active = item.exact ? pathname === item.href : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`rounded-xl px-3 py-2 text-sm font-bold ${
                  active ? "bg-brand text-white" : "text-foreground hover:bg-background"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
      </aside>
      <div className="min-w-0 flex-1">{children}</div>
    </div>
  );
}
