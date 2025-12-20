import { useEffect, useRef } from "react";
import { useLanguage } from "@/lib/i18n";

type QuotePreviewProps = {
  finalPrice: number;
  servings?: number;
  deliveryFee?: number;
  imageUrl?: string;
  message?: string;
};

export function QuotePreviewCard({
  finalPrice,
  servings,
  deliveryFee,
  imageUrl,
  message,
}: QuotePreviewProps) {
  const { copy } = useLanguage();

  // 🔒 BLOQUEO DEFINITIVO: solo se permite 1 render en toda la app
  const hasRendered = useRef(false);

  if (hasRendered.current) return null;

  useEffect(() => {
    hasRendered.current = true;
  }, []);

  if (!finalPrice || finalPrice <= 0) return null;

  return (
    <section className="quote-print mt-6 mx-auto max-w-md rounded-3xl border border-slate-200 bg-white p-6 shadow-lg print:shadow-none">
      {imageUrl ? (
        <img
          src={imageUrl}
          alt="Cake preview"
          className="mb-4 h-48 w-full rounded-xl object-cover"
        />
      ) : null}

      <h3 className="text-xl font-black text-brand-slate">
        Presupuesto de pastel
      </h3>

      <p className="mt-1 text-sm text-slate-500">
        {servings ? `${servings} porciones` : "Cotización personalizada"}
      </p>

      <div className="mt-4 space-y-2 text-sm">
        {deliveryFee && deliveryFee > 0 ? (
          <div className="flex justify-between">
            <span>Delivery</span>
            <span>${deliveryFee.toFixed(2)}</span>
          </div>
        ) : null}

        <div className="flex justify-between text-lg font-bold">
          <span>Total</span>
          <span>${finalPrice.toFixed(2)}</span>
        </div>
      </div>

      {message ? (
        <div className="mt-4 rounded-xl bg-slate-50 p-3 text-xs leading-relaxed text-slate-600">
          {message}
        </div>
      ) : null}
    </section>
  );
}
