"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/lib/auth-context";

export default function LoginPage() {
  const { login } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(email, password);
      router.push("/");
    } catch {
      setError("E-mail ou senha inválidos.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto flex min-h-[70vh] max-w-md flex-col justify-center px-4 py-10">
      <div className="rounded-3xl bg-surface p-7 shadow-lg">
        <h1 className="font-heading text-2xl font-extrabold text-brand-dark">
          Entrar no SuperJogosClick
        </h1>
        <p className="mt-1 text-sm text-muted">Continue jogando de onde parou!</p>

        <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-3">
          <input
            type="email"
            required
            placeholder="E-mail"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="rounded-xl border border-black/10 px-4 py-2.5 text-sm outline-none focus:border-brand"
          />
          <input
            type="password"
            required
            placeholder="Senha"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="rounded-xl border border-black/10 px-4 py-2.5 text-sm outline-none focus:border-brand"
          />
          {error && <p className="text-sm font-semibold text-accent-red">{error}</p>}
          <button
            disabled={loading}
            type="submit"
            className="mt-2 rounded-full bg-brand py-2.5 text-sm font-extrabold text-white shadow hover:bg-brand-dark disabled:opacity-60"
          >
            {loading ? "Entrando..." : "Entrar"}
          </button>
        </form>

        <p className="mt-5 text-center text-sm text-muted">
          Ainda não tem conta?{" "}
          <Link href="/cadastro" className="font-bold text-brand">
            Cadastre-se
          </Link>
        </p>
      </div>
    </div>
  );
}
