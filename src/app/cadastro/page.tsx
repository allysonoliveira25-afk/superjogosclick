"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/lib/auth-context";

export default function SignupPage() {
  const { signup } = useAuth();
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (password.length < 6) {
      setError("A senha precisa ter pelo menos 6 caracteres.");
      return;
    }
    setLoading(true);
    try {
      await signup(name, email, password);
      router.push("/perfil");
    } catch {
      setError("Não foi possível criar a conta. Verifique os dados e tente novamente.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto flex min-h-[70vh] max-w-md flex-col justify-center px-4 py-10">
      <div className="rounded-3xl bg-surface p-7 shadow-lg">
        <h1 className="font-heading text-2xl font-extrabold text-brand-dark">
          Criar minha conta
        </h1>
        <p className="mt-1 text-sm text-muted">
          Cadastre-se para favoritar jogos, ganhar pontos e criar seu boneco!
        </p>

        <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-3">
          <input
            required
            placeholder="Seu nome"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="rounded-xl border border-black/10 px-4 py-2.5 text-sm outline-none focus:border-brand"
          />
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
            placeholder="Senha (mín. 6 caracteres)"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="rounded-xl border border-black/10 px-4 py-2.5 text-sm outline-none focus:border-brand"
          />
          {error && <p className="text-sm font-semibold text-accent-red">{error}</p>}
          <button
            disabled={loading}
            type="submit"
            className="mt-2 rounded-full bg-accent-orange py-2.5 text-sm font-extrabold text-white shadow hover:brightness-105 disabled:opacity-60"
          >
            {loading ? "Criando..." : "Criar conta"}
          </button>
        </form>

        <p className="mt-5 text-center text-sm text-muted">
          Já tem conta?{" "}
          <Link href="/login" className="font-bold text-brand">
            Entrar
          </Link>
        </p>
      </div>
    </div>
  );
}
