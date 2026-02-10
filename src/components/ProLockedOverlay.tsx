"use client";

import { useLanguage } from "@/lib/i18n";

type ProLockedOverlayProps = {
  title?: string;
  description?: string;
  onUpgrade?: () => void;
};

export function ProLockedOverlay({
  title,
  description,
  onUpgrade,
}: ProLockedOverlayProps) {
  const { copy } = useLanguage();

  return (
    <div
      onClick={onUpgrade}
      className="flex cursor-pointer flex-col justify-between rounded-xl border border-dashed border-slate-300 bg-slate-50 p-4 hover:bg-slate-100 transition"
    >
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="text-xs font-bold uppercase tracking-wide text-slate-500">
            PRO
          </p>

          {/* TITLE */}
          <p className="mt-1 text-sm font-semibold text-brand-slate">
            {title || copy.pro?.locked}
          </p>

          {/* DESCRIPTION */}
          {description && (
            <p className="mt-1 text-xs text-slate-600">
              {description}
            </p>
          )}
          {/* FUNNEL MESSAGE */}
{copy?.pro?.funnel?.oneCakePays && (
  <p className="mt-2 text-xs font-semibold text-emerald-600">
    {copy.pro.funnel.oneCakePays}
  </p>
)}
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
