import { useLanguage } from "@/lib/i18n";
import { BRANDING } from "@/lib/branding";

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

  if (!finalPrice || finalPrice <= 0) return null;

  return (
    <section className="quote-print mt-6 mx-auto max-w-md rounded-3xl border border-slate-200 bg-white p-6 shadow-lg print:shadow-none">
      
      {/* BRAND */}
      {BRANDING?.businessName ? (
        <p className="mb-2 text-center text-xs font-semibold uppercase tracking-wide text-slate-400">
          {BRANDING.businessName}
        </p>
      ) : null}

      {/* IMAGE */}
      {imageUrl ? (
        <img
          src={imageUrl}
          alt="Cake preview"
          className="mb-4 h-48 w-full rounded-xl object-cover"
        />
      ) : null}

      {/* TITLE */}
      <h3 className="text-xl font-black text-brand-slate">
        {copy.client.quoteTitle}
      </h3>

      {/* SERVINGS */}
      <p className="mt-1 text-sm text-slate-500">
        {servings
          ? `${servings} ${copy.general.servings}`
          : copy.client.customQuote}
      </p>

      {/* PRICES */}
      <div className="mt-4 space-y-2 text-sm">
        {deliveryFee && deliveryFee > 0 ? (
          <div className="flex justify-between">
            <span>{copy.resultCard.rows.extrasDelivery}</span>
            <span>${(Number(deliveryFee) || 0).toFixed(2)}</span>
          </div>
        ) : null}

        <div className="flex justify-between text-lg font-bold">
          <span>{copy.general.total}</span>
          <span>${(Number(finalPrice) || 0).toFixed(2)}</span>
        </div>
      </div>

      {/* MESSAGE */}
      {message ? (
        <div className="mt-4 rounded-xl bg-slate-50 p-3 text-xs leading-relaxed text-slate-600">
          {message}
        </div>
      ) : null}
    </section>
  );
}
