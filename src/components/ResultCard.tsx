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

      <div className="mb-6 rounded-2xl border border-brand-peach/60 bg-gradient-to-r from-brand-cream via-white to-brand-peach/40 p-4 shadow-inner">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-xs uppercase tracking-wide text-slate-500">
              {copy.resultCard.highlightLabel}
            </p>
            <p className="text-3xl font-black text-brand-slate sm:text-4xl">
              ${pricing.recommendedPrice.toFixed(2)}
            </p>
            <p className="text-xs text-slate-500">{copy.resultCard.highlightNote}</p>
          </div>
          <div className="text-3xl" aria-hidden>
            🎂
          </div>
        </div>
      </div>
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
    className="block w-full text-sm text-slate-600
      file:mr-4 file:rounded-full file:border-0
      file:bg-brand-slate file:px-4 file:py-2
      file:text-sm file:font-semibold file:text-white
      hover:file:bg-brand-slate/90"
  />
</div>
{photo ? (
  <div className="mb-6 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
    <img
      src={photo}
      alt="Foto del pastel"
      className="h-56 w-full object-cover"
    />
  </div>
) : null}
      <div className="mt-6 rounded-3xl border border-slate-200 bg-white p-6 shadow-lg print:shadow-none">
  <div className="mb-4 text-center">
    <h3 className="text-2xl font-black text-brand-slate">
      Presupuesto de pastel
    </h3>
    <p className="text-sm text-slate-500">
      {servings ? `${servings} porciones` : "Cotización personalizada"}
    </p>
  </div>

  {photo ? (
    <div className="mb-4 overflow-hidden rounded-xl">
      <img
        src={photo}
        alt="Foto del pastel"
        className="h-48 w-full object-cover"
      />
    </div>
  ) : null}

  <div className="space-y-2 text-sm">
    <div className="flex justify-between">
      <span>Precio total</span>
      <span className="font-bold">
        ${pricing.recommendedPrice.toFixed(2)}
      </span>
    </div>

    {pricing.pricePerServing ? (
      <div className="flex justify-between text-slate-600">
        <span>Precio por porción</span>
        <span>
          ${pricing.pricePerServing.toFixed(2)}
        </span>
      </div>
    ) : null}
  </div>

  <div className="mt-4 rounded-xl bg-slate-50 p-3 text-xs text-slate-600">
    Este presupuesto incluye ingredientes, decoración y mano de obra.
    El precio puede ajustarse según cambios en el diseño final.
  </div>
</div>
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

          {pricing.pricePerServing ? (
            <Row
              label={copy.resultCard.rows.perServing}
              value={`$${pricing.pricePerServing.toFixed(2)}`}
            />
          ) : null}
        </div>
      ) : null}

      <p className="mt-4 text-xs leading-relaxed text-slate-500">
        {copy.resultCard.footer}
        <code className="ml-1 rounded bg-slate-100 px-1 py-0.5">src/lib/pricing.ts</code>.
      </p>
    </section>
  );
}
