"use client";

import { usePro } from "@/lib/pro";
import { useLanguage } from "@/lib/i18n";

export function ProStatusBadge() {
  const { isPro, isReady } = usePro();
  const { copy } = useLanguage();

  if (!isReady) return null;

  if (isPro) {
    return (
      <div className="inline-flex items-center gap-2 rounded-full bg-brand-rose/15 px-3 py-1 text-xs font-semibold text-brand-rose">
        <span>✨</span>
        <span>{copy?.pro?.active ?? "PRO activo"}</span>
      </div>
    );
  }

  return (
    <div className="inline-flex items-center gap-2 rounded-full border border-dashed border-slate-300 bg-white px-3 py-1 text-xs font-semibold text-slate-600">
      <span>🔒</span>
      <span>{copy?.pro?.free ?? "Versión FREE"}</span>
    </div>
  );
}
