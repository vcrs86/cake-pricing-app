"use client";

import { useLanguage } from "@/lib/i18n";

export function ProFeatures() {
  const { copy } = useLanguage();

  return (
    <div className="rounded-2xl border border-dashed border-slate-200 bg-white p-4 shadow-card sm:p-6">
      <div className="flex items-center gap-2">
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 text-lg">🔒</div>
        <div>
          <p className="text-sm font-bold text-brand-slate">{copy.proFeatures.title}</p>
          <p className="text-xs text-slate-500">{copy.proFeatures.preview}</p>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
        {copy.proFeatures.cards.map((card) => (
          <LockedTile key={card.title} title={card.title} description={card.description} />
        ))}
      </div>
    </div>
  );
}

function LockedTile({ title, description }: { title: string; description: string }) {
  const { copy } = useLanguage();
  return (
    <div className="flex h-full flex-col gap-2 rounded-xl border border-slate-100 bg-slate-50 p-3">
      <div className="flex items-center justify-between gap-2">
        <p className="text-sm font-semibold text-brand-slate">{title}</p>
        <span className="rounded-full bg-slate-200 px-2 py-1 text-[11px] font-bold uppercase tracking-wide text-slate-600">
          PRO
        </span>
      </div>
      <p className="text-xs text-slate-600">{description}</p>
      <div className="mt-auto flex items-center gap-2 rounded-lg border border-dashed border-slate-300 bg-white px-3 py-2 text-[11px] font-semibold text-slate-500">
        <span>🔒</span>
        <span>{copy.proFeatures.locked}</span>
      </div>
    </div>
  );
}
