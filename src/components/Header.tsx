"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { useAuth } from "@/lib/auth-context";
import CategoryIcon from "./CategoryIcon";
import AvatarPreview from "./AvatarPreview";
import type { Category } from "@/lib/types";

export default function Header({
  categories,
  siteName = "SuperJogosClick",
}: {
  categories: Category[];
  siteName?: string;
}) {
  const { user, profile, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [q, setQ] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    if (q.trim()) router.push(`/buscar?q=${encodeURIComponent(q.trim())}`);
  }

  const shortcuts = [
    { href: "/", label: "Início", emoji: "🏠", match: (p: string) => p === "/" },
    { href: "/favoritos", label: "Favoritos", emoji: "❤️", match: (p: string) => p.startsWith("/favoritos") },
    { href: "/buscar", label: "Buscar", emoji: "🔍", match: (p: string) => p.startsWith("/buscar") },
  ];

  return (
    <header className="sticky top-0 z-40 border-b border-black/5 bg-surface shadow-sm">
      <div className="mx-auto flex max-w-[1400px] items-center gap-3 px-3 py-2.5 sm:px-5">
        <Link href="/" className="flex shrink-0 items-center gap-2">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-brand to-accent-pink text-sm font-black text-white shadow">
            SJ
          </span>
          <span className="hidden font-heading text-lg font-extrabold tracking-tight text-foreground sm:block">
            {siteName}
          </span>
        </Link>

        <form
          onSubmit={handleSearch}
          className="mx-auto flex w-full max-w-md flex-1 items-center rounded-full border border-black/10 bg-background/40 px-3 py-1.5"
        >
          <span className="mr-1.5 text-muted">🔍</span>
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="O que você quer jogar hoje?"
            className="w-full bg-transparent text-sm text-foreground outline-none placeholder:text-muted"
          />
          <button
            type="submit"
            className="shrink-0 rounded-full bg-brand px-3 py-1 text-xs font-extrabold text-white hover:bg-brand-dark"
          >
            Buscar
          </button>
        </form>

        {user ? (
          <div className="relative shrink-0">
            <button
              onClick={() => setMenuOpen((v) => !v)}
              className="flex items-center gap-2 rounded-full border border-black/10 py-1 pl-1 pr-3 hover:bg-background/40"
            >
              <span className="h-8 w-8 overflow-hidden rounded-full bg-background">
                {profile && <AvatarPreview avatar={profile.avatar} />}
              </span>
              <span className="hidden max-w-[100px] truncate text-sm font-extrabold text-foreground sm:block">
                {profile?.displayName ?? "Jogador"}
              </span>
            </button>
            {menuOpen && (
              <div className="absolute right-0 mt-2 w-52 overflow-hidden rounded-xl bg-surface text-foreground shadow-xl ring-1 ring-black/5">
                <Link href="/perfil" className="block px-4 py-2.5 text-sm font-semibold hover:bg-background/30" onClick={() => setMenuOpen(false)}>
                  👤 Meu perfil
                </Link>
                <Link href="/favoritos" className="block px-4 py-2.5 text-sm font-semibold hover:bg-background/30" onClick={() => setMenuOpen(false)}>
                  ❤️ Favoritos
                </Link>
                <Link href="/historico" className="block px-4 py-2.5 text-sm font-semibold hover:bg-background/30" onClick={() => setMenuOpen(false)}>
                  🕑 Histórico
                </Link>
                {profile?.role === "admin" && (
                  <Link href="/admin" className="block px-4 py-2.5 text-sm font-semibold hover:bg-background/30" onClick={() => setMenuOpen(false)}>
                    ⚙️ Painel admin
                  </Link>
                )}
                <button
                  onClick={() => {
                    setMenuOpen(false);
                    logout();
                  }}
                  className="block w-full px-4 py-2.5 text-left text-sm font-semibold text-accent-red hover:bg-background/30"
                >
                  🚪 Sair
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="flex shrink-0 items-center gap-2">
            <Link
              href="/login"
              className="rounded-full px-3 py-1.5 text-sm font-bold text-foreground hover:bg-background/30"
            >
              Entrar
            </Link>
            <Link
              href="/cadastro"
              className="rounded-full bg-brand px-3.5 py-1.5 text-sm font-extrabold text-white shadow hover:bg-brand-dark"
            >
              Cadastrar
            </Link>
          </div>
        )}
      </div>

      <nav className="scrollbar-thin flex gap-2 overflow-x-auto px-3 pb-3 pt-1 sm:px-5">
        {shortcuts.map((s) => {
          const active = s.match(pathname);
          return (
            <Link
              key={s.href}
              href={s.href}
              className={`flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full border px-3 py-1.5 text-xs font-bold shadow-sm transition ${
                active
                  ? "border-brand bg-brand text-white"
                  : "border-black/10 bg-surface text-foreground hover:border-brand/40 hover:text-brand"
              }`}
            >
              <span
                className={`flex h-6 w-6 items-center justify-center rounded-full text-[13px] ${
                  active ? "bg-white/25" : "bg-background/50"
                }`}
              >
                {s.emoji}
              </span>
              {s.label}
            </Link>
          );
        })}
        <span className="mx-1 w-px shrink-0 bg-white/40" />
        {categories.map((c) => {
          const active = pathname === `/categoria/${c.slug}`;
          return (
            <Link
              key={c.id}
              href={`/categoria/${c.slug}`}
              className={`flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full border px-3 py-1.5 text-xs font-bold shadow-sm transition ${
                active
                  ? "border-brand bg-brand text-white"
                  : "border-black/10 bg-surface text-foreground hover:border-brand/40 hover:text-brand"
              }`}
            >
              <span
                className="flex h-6 w-6 items-center justify-center rounded-full text-white"
                style={{ backgroundColor: active ? "rgba(255,255,255,0.25)" : c.color }}
              >
                <CategoryIcon icon={c.icon} className="h-3.5 w-3.5" />
              </span>
              {c.label}
            </Link>
          );
        })}
      </nav>
    </header>
  );
}
