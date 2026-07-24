"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/lib/auth-context";
import { getAllUsers, setUserRole, playtimePoints } from "@/lib/users";
import type { UserProfile } from "@/lib/types";

export default function AdminUsersPage() {
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState<UserProfile[] | null>(null);

  async function load() {
    const all = await getAllUsers();
    setUsers(all.sort((a, b) => b.createdAt - a.createdAt));
  }

  useEffect(() => {
    void Promise.resolve().then(load);
  }, []);

  async function toggleRole(u: UserProfile) {
    if (u.uid === currentUser?.uid) return;
    await setUserRole(u.uid, u.role === "admin" ? "user" : "admin");
    load();
  }

  return (
    <div>
      <h1 className="font-heading text-2xl font-extrabold text-brand-dark">Usuários</h1>

      <div className="mt-4 overflow-x-auto rounded-2xl bg-surface shadow">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-black/5 text-left text-xs uppercase text-muted">
              <th className="px-4 py-3">Nome</th>
              <th className="px-4 py-3">E-mail</th>
              <th className="px-4 py-3">Pontos</th>
              <th className="px-4 py-3">Cadastro</th>
              <th className="px-4 py-3">Função</th>
            </tr>
          </thead>
          <tbody>
            {users?.map((u) => (
              <tr key={u.uid} className="border-b border-black/5 last:border-0">
                <td className="px-4 py-2.5 font-semibold">{u.displayName}</td>
                <td className="px-4 py-2.5">{u.email}</td>
                <td className="px-4 py-2.5">{playtimePoints(u.totalPlaytimeSeconds)}</td>
                <td className="px-4 py-2.5">{new Date(u.createdAt).toLocaleDateString("pt-BR")}</td>
                <td className="px-4 py-2.5">
                  <button
                    onClick={() => toggleRole(u)}
                    disabled={u.uid === currentUser?.uid}
                    className={`rounded-full px-3 py-1 text-xs font-extrabold ${
                      u.role === "admin" ? "bg-brand text-white" : "bg-background text-muted"
                    } disabled:opacity-50`}
                  >
                    {u.role === "admin" ? "Admin" : "Usuário"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {users?.length === 0 && <p className="p-6 text-center text-muted">Nenhum usuário ainda.</p>}
      </div>
    </div>
  );
}
