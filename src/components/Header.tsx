"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useAuth } from "@/lib/auth-context";
import CategoryIcon from "./CategoryIcon";
import AvatarPreview from "./AvatarPreview";
import type { Category } from "@/lib/types";

export default function Header({ categories }: { categories: Category[] }) {
  const { user, profile, logout } = useAuth();
  const router = useRouter();
  const [q, setQ] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const [navOpen, setNavOpen] = useState(false);

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    if (q.trim()) router.push(`/buscar?q=${encodeURIComponent(q.trim())}`);
  }

  return (
    <header className="sticky top-0 z-40 bg-brand text-white shadow-md">
      <div className="mx-auto flex max-w-[1400px] items-center gap-3 px-3 py-2.5 sm:px-5">
        <button
          className="rounded-lg p-1.5 hover:bg-white/15 lg:hidden"
          onClick={() => setNavOpen((v) => !v)}
          aria-label="Abrir categorias"
        >
          ☰
        </button>

        <Link href="/" className="flex shrink-0 items-center gap-2">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-accent-yellow text-lg font-black text-brand-dark shadow">
            SJ
          </span>
          <span className="hidden font-heading text-xl font-extrabold tracking-tight sm:block">
            Super<span className="text-accent-yellow">Jogos</span>Click
          </span>
        </Link>

        <form
          onSubmit={handleSearch}
          className="mx-1 flex flex-1 items-center rounded-full bg-white/95 px-3 py-1.5 text-foreground"
        >
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Buscar jogos..."
            className="w-full bg-transparent text-sm outline-none placeholder:text-muted"
          />
          <button type="submit" aria-label="Buscar" className="text-brand">
            🔍
          </button>
        </form>

        {user ? (
          <div className="relative shrink-0">
            <button
              onClick={() => setMenuOpen((v) => !v)}
              className="flex items-center gap-2 rounded-full bg-white/15 py-1 pl-1 pr-3 hover:bg-white/25"
            >
              <span className="h-7 w-7 overflow-hidden rounded-full bg-white">
                {profile && <AvatarPreview avatar={profile.avatar} />}
              </span>
              <span className="hidden max-w-[100px] truncate text-sm font-bold sm:block">
                {profile?.displayName ?? "Jogador"}
              </span>
            </button>
            {menuOpen && (
              <div className="absolute right-0 mt-2 w-52 overflow-hidden rounded-xl bg-white text-foreground shadow-xl">
                <Link href="/perfil" className="block px-4 py-2.5 text-sm font-semibold hover:bg-background" onClick={() => setMenuOpen(false)}>
                  👤 Meu perfil
                </Link>
                <Link href="/favoritos" className="block px-4 py-2.5 text-sm font-semibold hover:bg-background" onClick={() => setMenuOpen(false)}>
                  ❤️ Favoritos
                </Link>
                <Link href="/historico" className="block px-4 py-2.5 text-sm font-semibold hover:bg-background" onClick={() => setMenuOpen(false)}>
                  🕑 Histórico
                </Link>
                {profile?.role === "admin" && (
                  <Link href="/admin" className="block px-4 py-2.5 text-sm font-semibold hover:bg-background" onClick={() => setMenuOpen(false)}>
                    ⚙️ Painel admin
                  </Link>
                )}
                <button
                  onClick={() => {
                    setMenuOpen(false);
                    logout();
                  }}
                  className="block w-full px-4 py-2.5 text-left text-sm font-semibold text-accent-red hover:bg-background"
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
              className="rounded-full px-3 py-1.5 text-sm font-bold hover:bg-white/15"
            >
              Entrar
            </Link>
            <Link
              href="/cadastro"
              className="rounded-full bg-accent-orange px-3.5 py-1.5 text-sm font-extrabold text-white shadow hover:brightness-105"
            >
              Cadastrar
            </Link>
          </div>
        )}
      </div>

      <nav className="hidden gap-1 overflow-x-auto border-t border-white/15 bg-brand-dark px-5 py-1.5 lg:flex">
        {categories.map((c) => (
          <Link
            key={c.id}
            href={`/categoria/${c.slug}`}
            className="flex items-center gap-1.5 whitespace-nowrap rounded-full px-3 py-1 text-xs font-bold hover:bg-white/15"
          >
            <CategoryIcon icon={c.icon} className="h-4 w-4" />
            {c.label}
          </Link>
        ))}
      </nav>

      {navOpen && (
        <nav className="flex flex-col gap-0.5 border-t border-white/15 bg-brand-dark px-3 py-2 lg:hidden">
          {categories.map((c) => (
            <Link
              key={c.id}
              href={`/categoria/${c.slug}`}
              onClick={() => setNavOpen(false)}
              className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-bold hover:bg-white/15"
            >
              <CategoryIcon icon={c.icon} className="h-4 w-4" />
              {c.label}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}
