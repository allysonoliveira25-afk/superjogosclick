"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { updateUserProfile, playtimePoints } from "@/lib/users";
import AvatarPreview from "@/components/AvatarPreview";
import type { AvatarConfig } from "@/lib/types";

const SKIN_TONES = ["#F9DCC0", "#F2C99E", "#D9A066", "#B27A44", "#8A5A2B", "#5C3A21"];
const HAIR_COLORS = ["#241b3d", "#4A3222", "#B8860B", "#E5473C", "#7c4dff", "#2fb6ff"];
const OUTFIT_COLORS = ["#3AA0FF", "#FF7A1A", "#2BD576", "#FF5DA2", "#8B5CF6", "#F2C230"];
const BG_COLORS = ["#FFD23F", "#7c4dff", "#2fb6ff", "#ff5da2", "#2bd576", "#ff7a1a"];
const HAIR_STYLES: { value: AvatarConfig["hair"]; label: string }[] = [
  { value: "short", label: "Curto" },
  { value: "long", label: "Longo" },
  { value: "mohawk", label: "Moicano" },
  { value: "bald", label: "Careca" },
];
const ACCESSORIES: { value: AvatarConfig["accessory"]; label: string }[] = [
  { value: "none", label: "Nenhum" },
  { value: "glasses", label: "Óculos" },
  { value: "cap", label: "Boné" },
  { value: "star", label: "Estrela" },
];

function Swatch({
  color,
  active,
  onClick,
}: {
  color: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      style={{ backgroundColor: color }}
      className={`h-8 w-8 rounded-full border-2 transition ${
        active ? "border-brand-dark scale-110" : "border-white"
      } shadow`}
    />
  );
}

export default function PerfilPage() {
  const { user, profile, loading, refreshProfile } = useAuth();
  const router = useRouter();
  const [avatar, setAvatar] = useState<AvatarConfig | null>(null);
  const [avatarLoadedFor, setAvatarLoadedFor] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!loading && !user) router.push("/login");
  }, [loading, user, router]);

  // Mirror the freshly-loaded profile's avatar into local editable state once
  // per profile (adjusting state during render, not in an effect).
  if (profile && avatarLoadedFor !== profile.uid) {
    setAvatarLoadedFor(profile.uid);
    setAvatar(profile.avatar);
  }

  async function save() {
    if (!user || !avatar) return;
    setSaving(true);
    await updateUserProfile(user.uid, { avatar });
    await refreshProfile();
    setSaving(false);
  }

  if (loading || !profile || !avatar) {
    return <p className="p-10 text-center text-muted">Carregando perfil...</p>;
  }

  const points = playtimePoints(profile.totalPlaytimeSeconds);
  const minutes = Math.floor(profile.totalPlaytimeSeconds / 60);

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <h1 className="font-heading text-3xl font-extrabold text-brand-dark">
        Meu perfil
      </h1>

      <div className="mt-5 grid gap-5 sm:grid-cols-3">
        <div className="rounded-2xl bg-surface p-4 text-center shadow">
          <p className="text-xs font-bold uppercase text-muted">Pontos</p>
          <p className="mt-1 font-heading text-3xl font-extrabold text-accent-orange">
            {points}
          </p>
        </div>
        <div className="rounded-2xl bg-surface p-4 text-center shadow">
          <p className="text-xs font-bold uppercase text-muted">Minutos jogados</p>
          <p className="mt-1 font-heading text-3xl font-extrabold text-accent-blue">
            {minutes}
          </p>
        </div>
        <div className="rounded-2xl bg-surface p-4 text-center shadow">
          <p className="text-xs font-bold uppercase text-muted">Jogador desde</p>
          <p className="mt-1 font-heading text-lg font-extrabold text-brand">
            {new Date(profile.createdAt).toLocaleDateString("pt-BR")}
          </p>
        </div>
      </div>

      <div className="mt-8 grid gap-6 rounded-3xl bg-surface p-6 shadow lg:grid-cols-[220px_1fr]">
        <div className="flex flex-col items-center gap-3">
          <div className="h-40 w-40 overflow-hidden rounded-full shadow-inner">
            <AvatarPreview avatar={avatar} />
          </div>
          <p className="text-center font-heading text-lg font-extrabold">
            {profile.displayName}
          </p>
          <button
            onClick={save}
            disabled={saving}
            className="rounded-full bg-brand px-5 py-2 text-sm font-extrabold text-white shadow hover:bg-brand-dark disabled:opacity-60"
          >
            {saving ? "Salvando..." : "Salvar boneco"}
          </button>
        </div>

        <div className="flex flex-col gap-5">
          <div>
            <p className="mb-2 text-sm font-bold">Tom de pele</p>
            <div className="flex flex-wrap gap-2">
              {SKIN_TONES.map((c) => (
                <Swatch key={c} color={c} active={avatar.skin === c} onClick={() => setAvatar({ ...avatar, skin: c })} />
              ))}
            </div>
          </div>

          <div>
            <p className="mb-2 text-sm font-bold">Cabelo</p>
            <div className="flex flex-wrap gap-2">
              {HAIR_STYLES.map((h) => (
                <button
                  key={h.value}
                  onClick={() => setAvatar({ ...avatar, hair: h.value })}
                  className={`rounded-full border px-3 py-1.5 text-xs font-bold ${
                    avatar.hair === h.value ? "border-brand bg-brand/10 text-brand-dark" : "border-black/10"
                  }`}
                >
                  {h.label}
                </button>
              ))}
            </div>
            <div className="mt-2 flex flex-wrap gap-2">
              {HAIR_COLORS.map((c) => (
                <Swatch key={c} color={c} active={avatar.hairColor === c} onClick={() => setAvatar({ ...avatar, hairColor: c })} />
              ))}
            </div>
          </div>

          <div>
            <p className="mb-2 text-sm font-bold">Roupa</p>
            <div className="flex flex-wrap gap-2">
              {OUTFIT_COLORS.map((c) => (
                <Swatch key={c} color={c} active={avatar.outfit === c} onClick={() => setAvatar({ ...avatar, outfit: c })} />
              ))}
            </div>
          </div>

          <div>
            <p className="mb-2 text-sm font-bold">Acessório</p>
            <div className="flex flex-wrap gap-2">
              {ACCESSORIES.map((a) => (
                <button
                  key={a.value}
                  onClick={() => setAvatar({ ...avatar, accessory: a.value })}
                  className={`rounded-full border px-3 py-1.5 text-xs font-bold ${
                    avatar.accessory === a.value ? "border-brand bg-brand/10 text-brand-dark" : "border-black/10"
                  }`}
                >
                  {a.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <p className="mb-2 text-sm font-bold">Fundo</p>
            <div className="flex flex-wrap gap-2">
              {BG_COLORS.map((c) => (
                <Swatch key={c} color={c} active={avatar.bg === c} onClick={() => setAvatar({ ...avatar, bg: c })} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
