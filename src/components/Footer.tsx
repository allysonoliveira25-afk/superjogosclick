import Link from "next/link";
import { DEFAULT_SITE_SETTINGS, type CustomPage, type SiteSettings } from "@/lib/types";

const SOCIAL_LABELS: Record<keyof SiteSettings["social"], string> = {
  instagram: "Instagram",
  youtube: "YouTube",
  tiktok: "TikTok",
  facebook: "Facebook",
};

export default function Footer({
  settings = DEFAULT_SITE_SETTINGS,
  pages = [],
}: {
  settings?: SiteSettings;
  pages?: CustomPage[];
}) {
  const socialEntries = (Object.keys(settings.social) as (keyof SiteSettings["social"])[]).filter(
    (k) => settings.social[k]?.trim()
  );

  return (
    <footer className="mt-10 bg-[#241b3d] px-5 py-8 text-white/80">
      <div className="mx-auto flex max-w-[1400px] flex-wrap items-start justify-between gap-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent-yellow text-sm font-black text-brand-dark">
              SJ
            </span>
            <span className="font-heading text-lg font-extrabold text-white">
              {settings.siteName}
            </span>
          </div>
          <p className="mt-2 max-w-xs text-xs">{settings.description}</p>
          {settings.contactEmail && (
            <p className="mt-2 text-xs">
              Contato:{" "}
              <a href={`mailto:${settings.contactEmail}`} className="font-semibold text-white">
                {settings.contactEmail}
              </a>
            </p>
          )}
          {socialEntries.length > 0 && (
            <div className="mt-3 flex gap-3 text-xs">
              {socialEntries.map((k) => (
                <a key={k} href={settings.social[k]} target="_blank" rel="noopener noreferrer" className="font-semibold text-white hover:underline">
                  {SOCIAL_LABELS[k]}
                </a>
              ))}
            </div>
          )}
        </div>
        <div className="flex flex-wrap gap-10 text-xs">
          <div className="flex flex-col gap-1.5">
            <span className="mb-1 font-bold text-white">Conta</span>
            <Link href="/login">Entrar</Link>
            <Link href="/cadastro">Criar conta</Link>
            <Link href="/perfil">Meu perfil</Link>
          </div>
          <div className="flex flex-col gap-1.5">
            <span className="mb-1 font-bold text-white">Explorar</span>
            <Link href="/favoritos">Favoritos</Link>
            <Link href="/historico">Histórico</Link>
            <Link href="/buscar">Buscar jogos</Link>
          </div>
          {pages.length > 0 && (
            <div className="flex flex-col gap-1.5">
              <span className="mb-1 font-bold text-white">Site</span>
              {pages.map((p) => (
                <Link key={p.id} href={`/pagina/${p.slug}`}>
                  {p.title}
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
      <p className="mx-auto mt-6 max-w-[1400px] text-[11px] text-white/50">
        © {new Date().getFullYear()} {settings.siteName}. {settings.footerText}
      </p>
    </footer>
  );
}
