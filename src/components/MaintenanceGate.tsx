"use client";

import { useAuth } from "@/lib/auth-context";
import type { SiteSettings } from "@/lib/types";

export default function MaintenanceGate({
  settings,
  children,
}: {
  settings: SiteSettings;
  children: React.ReactNode;
}) {
  const { profile, loading } = useAuth();

  if (!settings.maintenanceMode) return <>{children}</>;

  const isAdmin = !loading && profile?.role === "admin";
  if (isAdmin) {
    return (
      <>
        <div className="bg-accent-orange px-4 py-2 text-center text-xs font-bold text-white">
          ⚠️ Modo manutenção ativado — só administradores veem o site normalmente.
        </div>
        {children}
      </>
    );
  }

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-3 px-6 text-center">
      <span className="text-5xl">🛠️</span>
      <h1 className="font-heading text-2xl font-extrabold text-white [text-shadow:0_1px_3px_rgba(0,0,0,0.15)]">
        Voltamos já!
      </h1>
      <p className="max-w-sm font-semibold text-white/80">{settings.maintenanceMessage}</p>
    </div>
  );
}
