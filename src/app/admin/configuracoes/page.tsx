"use client";

import { useEffect, useState } from "react";
import { getSiteSettings, updateSiteSettings } from "@/lib/settings";
import type { SiteSettings } from "@/lib/types";

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    void Promise.resolve()
      .then(() => getSiteSettings())
      .then(setSettings);
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!settings) return;
    setSaving(true);
    setSaved(false);
    await updateSiteSettings(settings);
    setSaving(false);
    setSaved(true);
  }

  if (!settings) return <p className="text-muted">Carregando...</p>;

  return (
    <div>
      <h1 className="font-heading text-2xl font-extrabold text-brand-dark">Configurações do site</h1>
      <p className="mt-1 text-sm text-muted">Nome, contato, redes sociais e modo manutenção.</p>

      <form onSubmit={handleSubmit} className="mt-5 flex max-w-2xl flex-col gap-5">
        <div className="rounded-2xl bg-surface p-5 shadow">
          <h2 className="mb-3 font-heading text-lg font-extrabold">Geral</h2>
          <div className="flex flex-col gap-3">
            <div>
              <label className="mb-1 block text-sm font-bold">Nome do site</label>
              <input
                value={settings.siteName}
                onChange={(e) => setSettings({ ...settings, siteName: e.target.value })}
                className="w-full rounded-xl border border-black/10 px-3 py-2 text-sm outline-none focus:border-brand"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-bold">Descrição (usada no rodapé e no SEO)</label>
              <textarea
                value={settings.description}
                onChange={(e) => setSettings({ ...settings, description: e.target.value })}
                rows={2}
                className="w-full rounded-xl border border-black/10 px-3 py-2 text-sm outline-none focus:border-brand"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-bold">E-mail de contato</label>
              <input
                type="email"
                value={settings.contactEmail}
                onChange={(e) => setSettings({ ...settings, contactEmail: e.target.value })}
                className="w-full rounded-xl border border-black/10 px-3 py-2 text-sm outline-none focus:border-brand"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-bold">Texto extra no rodapé (direitos autorais)</label>
              <input
                value={settings.footerText}
                onChange={(e) => setSettings({ ...settings, footerText: e.target.value })}
                className="w-full rounded-xl border border-black/10 px-3 py-2 text-sm outline-none focus:border-brand"
              />
            </div>
          </div>
        </div>

        <div className="rounded-2xl bg-surface p-5 shadow">
          <h2 className="mb-3 font-heading text-lg font-extrabold">Redes sociais</h2>
          <div className="grid gap-3 sm:grid-cols-2">
            {(Object.keys(settings.social) as (keyof SiteSettings["social"])[]).map((key) => (
              <div key={key}>
                <label className="mb-1 block text-sm font-bold capitalize">{key}</label>
                <input
                  value={settings.social[key]}
                  onChange={(e) =>
                    setSettings({ ...settings, social: { ...settings.social, [key]: e.target.value } })
                  }
                  placeholder="https://..."
                  className="w-full rounded-xl border border-black/10 px-3 py-2 text-sm outline-none focus:border-brand"
                />
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl bg-surface p-5 shadow">
          <h2 className="mb-3 font-heading text-lg font-extrabold">Manutenção</h2>
          <label className="flex items-center gap-2 text-sm font-bold">
            <input
              type="checkbox"
              checked={settings.maintenanceMode}
              onChange={(e) => setSettings({ ...settings, maintenanceMode: e.target.checked })}
            />
            Ativar modo manutenção (só administradores veem o site normalmente)
          </label>
          <div className="mt-3">
            <label className="mb-1 block text-sm font-bold">Mensagem exibida aos visitantes</label>
            <textarea
              value={settings.maintenanceMessage}
              onChange={(e) => setSettings({ ...settings, maintenanceMessage: e.target.value })}
              rows={2}
              className="w-full rounded-xl border border-black/10 px-3 py-2 text-sm outline-none focus:border-brand"
            />
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            disabled={saving}
            type="submit"
            className="self-start rounded-full bg-brand px-6 py-2.5 text-sm font-extrabold text-white shadow hover:bg-brand-dark disabled:opacity-60"
          >
            {saving ? "Salvando..." : "Salvar configurações"}
          </button>
          {saved && <span className="text-sm font-bold text-accent-green">✓ Salvo!</span>}
        </div>
      </form>
    </div>
  );
}
