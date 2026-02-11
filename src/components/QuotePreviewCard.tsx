import { useLanguage } from "@/lib/i18n";
import { BRANDING } from "@/lib/branding";

type QuotePreviewProps = {
  finalPrice: number;
  servings?: number;
  deliveryFee?: number;
  imageUrl?: string;
  message?: string;

  businessName?: string;
  businessLogo?: string | null;
};

export function QuotePreviewCard({
  finalPrice,
  servings,
  deliveryFee,
  imageUrl,
  message,
  businessName,
  businessLogo,
}: QuotePreviewProps) {

  const { copy } = useLanguage();

  if (!finalPrice || finalPrice <= 0) return null;

  return (
    <section className="quote-print mt-6 mx-auto max-w-md rounded-3xl border border-slate-200 bg-white p-6 shadow-lg print:shadow-none">
      {/* BRANDING — SOLO SI EXISTE */}
{(businessName || businessLogo) && (
  <div className="mb-4 flex flex-col items-center justify-center text-center">
    {businessLogo && (
      <img
        src={businessLogo}
        alt={businessName || "Brand"}
        className="mb-2 max-h-14 max-w-[180px] object-contain"
      />
    )}

    {businessName && (
      <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
        {businessName}
      </p>
    )}
  </div>
)}


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
    ? `${servings} ${copy.client.servingsLabel}`
    : ""}
</p>


      {/* PRICES */}
      {/* TOTAL — HERO */}
<div className="mt-6 rounded-3xl bg-brand-cream/40 p-6 text-center ring-1 ring-brand-rose/20">
  <p className="text-xs font-bold uppercase tracking-widest text-slate-500">
    {copy.client.totalLabel}
  </p>

  <p className="mt-2 text-4xl sm:text-5xl font-extrabold tracking-tight text-brand-slate">
    ${Number(finalPrice || 0).toFixed(2)}
  </p>
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