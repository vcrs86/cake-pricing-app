import { type PricingBreakdown } from "@/lib/pricing";

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
  return (
    <section className="rounded-2xl bg-white/90 p-5 shadow-card ring-1 ring-brand-cream backdrop-blur sm:p-6">
      <div className="mb-5 flex items-center justify-between gap-3">
        <div className="space-y-1">
          <p className="text-xs uppercase tracking-wide text-slate-500">Your quote</p>
          <h2 className="text-xl font-bold text-brand-slate">Ready-to-share pricing</h2>
        </div>
        {servings ? (
          <span className="rounded-full bg-brand-rose/30 px-3 py-1 text-xs font-semibold text-brand-slate">
            {servings} servings
          </span>
        ) : null}
      </div>

      <div className="mb-4 rounded-2xl border border-brand-peach/60 bg-gradient-to-r from-brand-cream via-white to-brand-peach/40 p-4 shadow-inner">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-xs uppercase tracking-wide text-slate-500">Celebration-ready total</p>
            <p className="text-3xl font-black text-brand-slate sm:text-4xl">${pricing.recommendedPrice.toFixed(2)}</p>
            <p className="text-xs text-slate-500">Includes a gentle 7% cushion for last-minute tweaks.</p>
          </div>
          <div className="text-3xl" aria-hidden>
            🎂
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <Row label="Ingredients" value={`$${pricing.ingredientsCost.toFixed(2)}`} />
        <Row
          label={`Decoration & labor (x${pricing.complexityMultiplier.toFixed(2)})`}
          value={`$${pricing.decorationAndLabor.toFixed(2)}`}
        />
        <Row label="Labor only" value={`$${pricing.laborCost.toFixed(2)}`} />
        <Row label="Extras + delivery" value={`$${(pricing.extrasCost + pricing.deliveryFee).toFixed(2)}`} />
        <Row label="Base cost" value={`$${pricing.baseCost.toFixed(2)}`} />
        <Row label="Profit" value={`$${pricing.profitAmount.toFixed(2)}`} />
        <hr className="my-3 border-dashed" />
        <Row label="Suggested minimum" value={`$${pricing.suggestedMinimum.toFixed(2)}`} />
        <Row label="Recommended price" value={`$${pricing.recommendedPrice.toFixed(2)}`} />
        {pricing.pricePerServing ? (
          <Row
            label="Price per serving"
            value={`$${pricing.pricePerServing.toFixed(2)}`}
          />
        ) : null}
      </div>
      <p className="mt-4 text-xs leading-relaxed text-slate-500">
        The recommended price adds a 7% cushion to cover last-minute tweaks, delivery time, or taste tests. Complexity multiplies
        decoration + labor so ornate designs are covered. Adjust the buffer or margin any time—pricing logic is kept in
        <code className="ml-1 rounded bg-slate-100 px-1 py-0.5">src/lib/pricing.ts</code>.
      </p>
    </section>
  );
}
