import { type PricingBreakdown } from "@/lib/pricing";
import { useLanguage } from "@/lib/i18n";
import { useState } from "react";
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
  const [photo, setPhoto] = useState<string | null>(null);

  const hasIngredients = pricing.ingredientsCost > 0;
  const hasAnyCost = pricing.baseCost > 0;

  return (
    <section className="rounded-2xl bg-white/90 p-5 shadow-card ring-1 ring-brand-cream backdrop-blur sm:p-6">
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
        <p className="text-3xl font-black text-brand-slate sm:text-4xl">
          ${pricing.recommendedPrice.toFixed(2)}
        </p>
        <p className="text-xs text-slate-500">
          {copy.resultCard.highlightNote}
        </p>
      </div>

      {/* FOTO */}
      <div className="mb-6 space-y-2">
        <label className="block text-sm font-semibold text-slate-700">
          📷 Foto del pastel (opcional)
        </label>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (!file) return;

            const reader = new FileReader();
            reader.onload = () => setPhoto(reader.result as string);
            reader.readAsDataURL(file);
          }}
        />
        {photo ? (
  <div className="mt-4 overflow-hidden rounded-2xl border border-slate-200">
    <img
      src={photo}
      alt="Vista previa del pastel"
      className="h-56 w-full object-cover"
    />
  </div>
) : null}
      </div>

      {/* BOTÓN DE IMPRESIÓN (SOLO SI HAY FOTO) */}
      {photo ? (
        <button
          onClick={() => window.print()}
          className="mb-6 w-full rounded-xl bg-brand-slate px-4 py-3 text-sm font-semibold text-white"
        >
          📄 Descargar / Imprimir presupuesto
        </button>
      ) : null}

      {/* DESGLOSE INTERNO */}
      {hasAnyCost ? (
        <div className="space-y-2">
          {hasIngredients ? (
            <Row
              label={copy.resultCard.rows.ingredients}
              value={`$${pricing.ingredientsCost.toFixed(2)}`}
            />
          ) : null}

          <Row
            label={`${copy.resultCard.rows.decoration} (x${pricing.complexityMultiplier.toFixed(2)})`}
            value={`$${pricing.decorationAndLabor.toFixed(2)}`}
          />

          <Row
            label={copy.resultCard.rows.laborOnly}
            value={`$${pricing.laborCost.toFixed(2)}`}
          />

          <Row
            label={copy.resultCard.rows.extrasDelivery}
            value={`$${(pricing.extrasCost + pricing.deliveryFee).toFixed(2)}`}
          />

          <Row
            label={copy.resultCard.rows.baseCost}
            value={`$${pricing.baseCost.toFixed(2)}`}
          />

          <Row
            label={copy.resultCard.rows.profit}
            value={`$${pricing.profitAmount.toFixed(2)}`}
          />

          <hr className="my-3 border-dashed" />

          <Row
            label={copy.resultCard.rows.suggested}
            value={`$${pricing.suggestedMinimum.toFixed(2)}`}
          />

          <Row
            label={copy.resultCard.rows.recommended}
            value={`$${pricing.recommendedPrice.toFixed(2)}`}
          />
        </div>
      ) : null}
    </section>
  );
}
