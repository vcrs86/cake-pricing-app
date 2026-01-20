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

  // Precio por porción
  const perServing =
    servings && servings > 0 ? pricing.recommendedPrice / servings : 0;

  // Costos operativos PRO (robusto)
  const additionalCostRaw =
    (pricing as any)?.result?.additionalCosts ??
    (pricing as any).additionalCost ??
    0;

  const additionalCost =
    typeof additionalCostRaw === "number" ? additionalCostRaw : 0;

    console.log("RESULT CARD NUEVO CARGADO");

  return (
  <section className="relative overflow-hidden rounded-3xl bg-white/60 backdrop-blur-xl p-6 shadow-xl ring-1 ring-white/40 sm:p-7">
    {/* ================= HEADER ================= */}
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

    {/* ================= DESGLOSE ================= */}
    <div className="space-y-2">

      {/* 1. INGREDIENTES */}
      {hasIngredients && (
        <Row
          label={copy.resultCard.rows.ingredients}
          value={formatCurrency(pricing.ingredientsCost)}
        />
      )}

      {/* 2. DECORACIÓN + MANO DE OBRA */}
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

      {/* 3. GANANCIA */}
      <Row
        label={copy.resultCard.rows.profit}
        value={formatCurrency(pricing.profitAmount)}
      />

      {/* 4. SUBTOTAL – COSTO BASE */}
      <div className="my-3 rounded-xl border border-dashed border-slate-300 bg-slate-50 p-3">
        <Row
          label={copy.resultCard.rows.baseCost}
          value={formatCurrency(pricing.baseCost)}
        />
      </div>

      {/* 5. EXTRAS & DELIVERY (SIN GANANCIA) */}
      <Row
        label={copy.resultCard.rows.extrasDelivery}
        value={formatCurrency(pricing.extrasCost + pricing.deliveryFee)}
      />

      <p className="text-[11px] text-slate-400 italic">
        {copy.resultCard.extrasNote}
      </p>

      {/* 6. COSTOS OPERATIVOS PRO */}
      {additionalCost > 0 && (
        <>
          <Row
            label={
              copy.resultCard.rows.additionalCosts ||
              copy.pro.includeCosts.title
            }
            value={`+${formatCurrency(additionalCost)}`}
          />
          <p className="text-[11px] text-slate-400 italic">
            {copy.resultCard.operationalNote}
          </p>
        </>
      )}

      <hr className="my-3 border-dashed" />

      {/* 7. PRECIO SUGERIDO */}
      <Row
        label={copy.resultCard.rows.suggested}
        value={formatCurrency(pricing.suggestedMinimum + additionalCost)}
      />

      <p className="text-[11px] text-slate-400 italic">
        {copy.resultCard.suggestedNote}
      </p>
    </div>

    {/* ================= PRECIO RECOMENDADO ================= */}
    <div className="mt-6 rounded-2xl border border-brand-peach/60 bg-gradient-to-r from-brand-cream via-white to-brand-peach/40 p-4 shadow-inner">
      <p className="text-xs uppercase tracking-wide text-slate-500">
        {copy.resultCard.highlightLabel}
      </p>

      <p className="text-3xl font-black">
        {formatCurrency(pricing.recommendedPrice)}
      </p>

      {perServing > 0 ? (
        <p className="mt-1 text-sm text-slate-500">
          {formatCurrency(perServing)} / {servings} {copy.general.servings}
        </p>
      ) : null}

      <p className="mt-2 text-xs text-slate-500">
        {copy.resultCard.highlightNote}
      </p>
    </div>
  </section>
);
}
