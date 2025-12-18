import { type PricingBreakdown } from "@/lib/pricing";
import { useLanguage } from "@/lib/i18n";
import { Sparkles } from "lucide-react";
const Row = ({ label, value }: { label: string; value: string }) => (
  <div className="flex items-center justify-between text-sm font-medium text-slate-700">
    <span>{label}</span>
    <span className="text-slate-900">{value}</span>
  </div>
);

export function ResultCard({
  pricing,
  servings,
}: {
  pricing: PricingBreakdown;
  servings?: number;
}) {
  const { copy } = useLanguage();

  return (
    <section className="rounded-2xl bg-white/90 p-5 shadow-card ring-1 ring-brand-cream backdrop-blur sm:p-6">
      <div className="mb-5 flex items-center justify-between gap-3">
        <div className="space-y-1">
          <p className="text-xs uppercase tracking-wide text-slate-500">{copy.resultCard.badge}</p>
          <h2 className="flex items-center gap-2 text-xl font-semibold">
  <Sparkles className="w-4 h-4 text-brand-rose/70" />
  {copy.resultCard.title}
</h2>
        </div>
        {servings ? (
          <span className="rounded-full bg-brand-rose/30 px-3 py-1 text-xs font-semibold text-brand-slate">
            {servings} {copy.resultCard.servings}
          </span>
        ) : null}
      </div>

      <div className="mb-6 rounded-2xl border border-brand-peach/60 bg-gradient-to-r from-brand-cream via-white to-brand-peach/40 p-4 shadow-inner">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-xs uppercase tracking-wide text-slate-500">{copy.resultCard.highlightLabel}</p>
            <p className="text-3xl font-black text-brand-slate sm:text-4xl">${pricing.recommendedPrice.toFixed(2)}</p>
            <p className="text-xs text-slate-500">{copy.resultCard.highlightNote}</p>
          </div>
          <div className="text-3xl" aria-hidden>
            🎂
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <Row label={copy.resultCard.rows.ingredients} value={`$${pricing.ingredientsCost.toFixed(2)}`} />
        <Row
          label={`${copy.resultCard.rows.decoration} (x${pricing.complexityMultiplier.toFixed(2)})`}
          value={`$${pricing.decorationAndLabor.toFixed(2)}`}
        />
        <Row label={copy.resultCard.rows.laborOnly} value={`$${pricing.laborCost.toFixed(2)}`} />
        <Row label={copy.resultCard.rows.extrasDelivery} value={`$${(pricing.extrasCost + pricing.deliveryFee).toFixed(2)}`} />
        <Row label={copy.resultCard.rows.baseCost} value={`$${pricing.baseCost.toFixed(2)}`} />
        <Row label={copy.resultCard.rows.profit} value={`$${pricing.profitAmount.toFixed(2)}`} />
        <hr className="my-3 border-dashed" />
        <Row label={copy.resultCard.rows.suggested} value={`$${pricing.suggestedMinimum.toFixed(2)}`} />
        <Row label={copy.resultCard.rows.recommended} value={`$${pricing.recommendedPrice.toFixed(2)}`} />
        {pricing.pricePerServing ? (
          <Row
            label={copy.resultCard.rows.perServing}
            value={`$${pricing.pricePerServing.toFixed(2)}`}
          />
        ) : null}
      </div>
      <p className="mt-4 text-xs leading-relaxed text-slate-500">
        {copy.resultCard.footer}
        <code className="ml-1 rounded bg-slate-100 px-1 py-0.5">src/lib/pricing.ts</code>.
      </p>
    </section>
  );
}
