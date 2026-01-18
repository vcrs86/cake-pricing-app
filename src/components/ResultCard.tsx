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
  const hasAnyCost = pricing.baseCost > 0 || pricing.recommendedPrice > 0;

  // ✅ Precio por porción (seguro)
  const perServing =
    servings && servings > 0 ? pricing.recommendedPrice / servings : 0;

  // ✅ Costos adicionales PRO (defensivo)
  const additionalCostRaw =
    (pricing as any).additionalCost ??
    (pricing as any).additionalCosts ??
    (pricing as any).additionalCostsTotal ??
    0;

  const additionalCost =
    typeof additionalCostRaw === "number" ? additionalCostRaw : 0;

  // ✅ Label seguro
  const additionalCostLabel =
    copy?.pro?.includeCosts?.title || "Costos operativos (PRO)";

  // ✅ Totales VISUALES (no rompen pricing)
  const suggestedFinal = pricing.suggestedMinimum + additionalCost;

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

        {perServing > 0 && servings ? (
          <p className="mt-1 text-sm text-slate-500">
            {formatCurrency(perServing)} / {servings} {copy.general.servings}
          </p>
        ) : null}

        {additionalCost > 0 ? (
          <div className="mt-3 flex items-center justify-between rounded-xl bg-white/70 px-3 py-2 text-sm text-slate-700 ring-1 ring-slate-200">
            <span className="font-semibold">{additionalCostLabel}</span>
            <span className="font-bold">+{formatCurrency(additionalCost)}</span>
          </div>
        ) : null}

        <p className="mt-2 text-xs text-slate-500">
          {copy.resultCard.highlightNote}
        </p>
      </div>

      {/* DESGLOSE */}
      {hasAnyCost ? (
        <div className="space-y-2">
          {hasIngredients ? (
            <Row
              label={copy.resultCard.rows.ingredients}
              value={formatCurrency(pricing.ingredientsCost)}
            />
          ) : null}

          <Row
            label={`${copy.resultCard.rows.decoration} (x${(
              Number(pricing.complexityMultiplier) || 0
            ).toFixed(2)})`}
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

          {/* 👇 PRO EXPLÍCITO */}
          {additionalCost > 0 ? (
            <Row
              label={additionalCostLabel}
              value={`+${formatCurrency(additionalCost)}`}
            />
          ) : null}

          <Row
            label={copy.resultCard.rows.baseCost}
            value={formatCurrency(pricing.baseCost)}
          />

          <Row
            label={copy.resultCard.rows.profit}
            value={formatCurrency(pricing.profitAmount)}
          />

          <hr className="my-3 border-dashed" />

          {/* ✅ SUGERIDO FINAL (CUADRA CON ARRIBA) */}
          <Row
            label={copy.resultCard.rows.suggested}
            value={formatCurrency(suggestedFinal)}
          />
        </div>
      ) : null}
    </section>
  );
}
