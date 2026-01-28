"use client";

import { useLanguage } from "@/lib/i18n";

type ProLockedOverlayProps = {
  description?: string;
};

export function ProLockedOverlay({ description }: ProLockedOverlayProps) {
  const { copy } = useLanguage();

  return (
    <div className="flex h-full flex-col justify-between rounded-xl border border-dashed border-slate-300 bg-slate-50 p-4">
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="text-xs font-bold uppercase tracking-wide text-slate-500">
            PRO
          </p>
          <p className="mt-1 text-sm font-semibold text-brand-slate">
            {description || copy?.pro?.locked || "Función exclusiva PRO"}
          </p>
        </div>

        <span className="rounded-full bg-slate-200 px-2 py-1 text-[11px] font-bold uppercase tracking-wide text-slate-600">
          🔒 PRO
        </span>
      </div>

      <div className="mt-4 flex items-center gap-2 text-xs font-semibold text-brand-rose">
        <span>✨</span>
        <span>{copy?.pro?.cta || "Desbloquear PRO"}</span>
      </div>
    </div>
  );
}
