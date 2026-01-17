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
  formatCurrency,
}: {
  pricing: PricingBreakdown;
  servings?: number;
  formatCurrency: (value: number) => string;
}) {
  const { copy } = useLanguage();

  const hasIngredients = pricing.ingredientsCost > 0;
  const hasAnyCost = pricing.baseCost > 0;

  return (
    <section className="relative overflow-hidden rounded-3xl bg-white/60 backdrop-blur-xl p-6 shadow-xl ring-1 ring-white/40 sm:p-7">
      {/* HEADER */}
      <div className="mb-5 flex items-center justify-between gap-3">
        <div className="space-y-1">
          <p className="text-xs uppercase tracking-wide text-slate-500">
            {copy.resultCard.badge}
          </p>
          <h2 className="flex items-center gap-2 text-xl font-semibold">
            <Sparkles className="h-4 w-4 text-brand-rose/70" />
            {copy.resultCard.title}
          </h2>
        </div>

        {servings ? (
          <span className="rounded-full bg-brand-rose/30 px-3 py-1 text-xs font-semibold text-brand-slate">
            {servings} {copy.resultCard.servings}
          </span>
        ) : null}
      </div>

      {/* PRECIO RECOMENDADO */}
      <div className="mb-6 rounded-2xl border border-brand-peach/60 bg-gradient-to-r from-brand-cream via-white to-brand-peach/40 p-4 shadow-inner">
        <p className="text-xs uppercase tracking-wide text-slate-500">
          {copy.resultCard.highlightLabel}
        </p>
        <p className="text-3xl font-black">
          {formatCurrency(pricing.recommendedPrice)}
        </p>
        <p className="text-xs text-slate-500">
          {copy.resultCard.highlightNote}
        </p>
      </div>

      {/* DESGLOSE INTERNO */}
      {hasAnyCost ? (
        <div className="space-y-2">
          {hasIngredients ? (
            <Row
              label={copy.resultCard.rows.ingredients}
              value={formatCurrency(pricing.ingredientsCost)}
            />
          ) : null}

          <Row
            label={`${copy.resultCard.rows.decoration} (x${(Number(pricing.complexityMultiplier) || 0).toFixed(2)})`}
            value={formatCurrency(pricing.decorationAndLabor)}
          />

          <Row
            label={copy.resultCard.rows.laborOnly}
            value={formatCurrency(pricing.laborCost)}
          />

          <Row
            label={copy.resultCard.rows.extrasDelivery}
            value={formatCurrency(pricing.extrasCost + pricing.deliveryFee)}
          />

          <Row
            label={copy.resultCard.rows.baseCost}
            value={formatCurrency(pricing.baseCost)}
          />

          <Row
            label={copy.resultCard.rows.profit}
            value={formatCurrency(pricing.profitAmount)}
          />

          <hr className="my-3 border-dashed" />

          <Row
            label={copy.resultCard.rows.suggested}
            value={formatCurrency(pricing.suggestedMinimum)}
          />

          <Row
            label={copy.resultCard.rows.recommended}
            value={formatCurrency(pricing.recommendedPrice)}
          />
        </div>
      ) : null}
    </section>
  );
}
