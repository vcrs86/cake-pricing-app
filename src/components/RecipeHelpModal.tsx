"use client";

import { useLanguage } from "@/lib/i18n";

type Props = {
  title?: string;
  description?: string;
  bullets?: string[];
  onClose: () => void;
};

export function RecipeHelpModal({
  title,
  description,
  bullets,
  onClose,
}: Props) {
  const { copy } = useLanguage();

  // Fallback para Recipes (no romper lo existente)
  const fallback = copy.help?.recipe;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="w-full max-w-lg rounded-3xl bg-white p-6 shadow-xl space-y-4">

        {/* HEADER */}
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-brand-slate">
            🧁 {title || fallback?.title}
          </h2>

          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600"
          >
            ✕
          </button>
        </div>

        {/* CONTENT */}
        <div className="space-y-3 text-sm text-slate-600 leading-relaxed">

          {/* Custom dynamic content (Rent / Utilities) */}
          {title && description && bullets ? (
            <>
              <p>{description}</p>

              <ul className="space-y-2 list-disc pl-5">
                {bullets.map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            </>
          ) : (
            /* Fallback Recipes content */
            <>
              <p><strong>{fallback?.step1Title}</strong></p>
              <p>{fallback?.step1Text}</p>

              <p><strong>{fallback?.step2Title}</strong></p>
              <p>{fallback?.step2Text}</p>

              <p><strong>{fallback?.step3Title}</strong></p>
              <p>{fallback?.step3Text}</p>

              <p><strong>{fallback?.step4Title}</strong></p>
              <p>{fallback?.step4Text}</p>

              <p><strong>{fallback?.step5Title}</strong></p>
              <p>{fallback?.step5Text}</p>

              <p className="text-brand-rose font-semibold">
                ⚠️ {fallback?.warning}
              </p>
            </>
          )}

        </div>

        {/* FOOTER */}
        <button
          onClick={onClose}
          className="w-full rounded-xl bg-brand-slate py-2 text-sm font-semibold text-white"
        >
          {fallback?.close || "Cerrar"}
        </button>

      </div>
    </div>
  );
}
