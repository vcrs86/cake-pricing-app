"use client";

import { CalculatorForm, type CalculatorFormState } from "@/components/CalculatorForm";
import { IngredientManager } from "@/components/IngredientManager";
import { RecipeBuilder, type RecipeLineInput } from "@/components/RecipeBuilder";
import { ResultCard } from "@/components/ResultCard";
import { ProFeatures } from "@/components/ProFeatures";
import { CAKE_SIZES, calculatePricing } from "@/lib/pricing";
import { useMemo, useState } from "react";
import { buildIngredient, calculateRecipeCost, type Ingredient, type RecipeLine } from "@/lib/ingredients";
import { useLanguage } from "@/lib/i18n";
import { QuotePreviewCard } from "@/components/QuotePreviewCard";
const DEFAULT_STATE: CalculatorFormState = {
  cakeSize: CAKE_SIZES[1].id,
  basicIngredientsCost: "0",
  decorationCost: "0",
  hoursWorked: "0",
  hourlyRate: "0",
  setupHours: "0",
  setupRate: "0",
  profitMargin: "30",
  deliveryFee: "0",
  decorationComplexity: "intermediate",
  cakeTopper: "0",
  sugarFlowers: "0",
  freshFlowers: "0",
  figures3d: "0",
};

const DEFAULT_INGREDIENTS: Ingredient[] = [];

export default function HomePage() {
  const { copy, language, setLanguage } = useLanguage();
  const [mode, setMode] = useState<"basic" | "advanced">("basic");
  const [values, setValues] = useState<CalculatorFormState>(DEFAULT_STATE);
  const [hasCalculated, setHasCalculated] = useState<boolean>(false);
  const [ingredients, setIngredients] = useState<Ingredient[]>(DEFAULT_INGREDIENTS);
  const [recipeLines, setRecipeLines] = useState<RecipeLineInput[]>([]);
  const [clientPhoto, setClientPhoto] = useState<string | null>(null);

  const selectedSize = useMemo(
    () => CAKE_SIZES.find((size) => size.id === values.cakeSize) ?? CAKE_SIZES[0],
    [values.cakeSize]
  );

  const recipeLineNumbers: RecipeLine[] = useMemo(
    () =>
      recipeLines.map((line) => ({
        id: line.id,
        ingredientId: line.ingredientId,
        quantity: Number(line.quantity) || 0,
      })),
    [recipeLines]
  );

  const recipeCost = useMemo(
    () => calculateRecipeCost(ingredients, recipeLineNumbers),
    [ingredients, recipeLineNumbers]
  );

  const ingredientCost =
  mode === "advanced"
    ? ingredients.length === 0
      ? 0
      : recipeCost.total
    : Number(values.basicIngredientsCost) || 0;

  const decorationExtrasTotal =
    mode === "advanced"
      ? (Number(values.cakeTopper) || 0) +
        (Number(values.sugarFlowers) || 0) +
        (Number(values.freshFlowers) || 0) +
        (Number(values.figures3d) || 0)
      : (Number(values.cakeTopper) || 0) + (Number(values.freshFlowers) || 0);

  const decorationCostValue = mode === "advanced" ? Number(values.decorationCost) || 0 : 0;
  const setupHoursValue = mode === "advanced" ? Number(values.setupHours) || 0 : 0;
  const setupRateValue = mode === "advanced" ? Number(values.setupRate) || 0 : 0;
  const deliveryFeeValue = mode === "advanced" ? Number(values.deliveryFee) || 0 : 0;

  const pricing = useMemo(
    () =>
      calculatePricing({
        ingredientsCost: ingredientCost,
        decorationCost: decorationCostValue,
        decorationExtras: decorationExtrasTotal,
        decorationComplexity: values.decorationComplexity,
        hoursWorked: Number(values.hoursWorked) || 0,
        hourlyRate: Number(values.hourlyRate) || 0,
        setupHours: setupHoursValue,
        setupRate: setupRateValue,
        deliveryFee: deliveryFeeValue,
        profitMargin: Number(values.profitMargin) || 0,
        servings: selectedSize.servings,
      }),
    [
      ingredientCost,
      decorationCostValue,
      decorationExtrasTotal,
      values.decorationComplexity,
      values.hoursWorked,
      values.hourlyRate,
      setupHoursValue,
      setupRateValue,
      deliveryFeeValue,
      values.profitMargin,
      selectedSize.servings,
    ]
  );

  const handleAddIngredient = (ingredient: Ingredient) => {
    setIngredients((prev) => [...prev, ingredient]);
  };

  const handleUpdateIngredient = (
    id: string,
    patch: Partial<Pick<Ingredient, "name" | "unit" | "packageSize" | "packageCost">>
  ) => {
    setIngredients((prev) =>
      prev.map((ingredient) =>
        ingredient.id === id
          ? buildIngredient({
              ...ingredient,
              ...patch,
              packageSize: patch.packageSize ?? ingredient.packageSize,
              packageCost: patch.packageCost ?? ingredient.packageCost,
            })
          : ingredient
      )
    );
  };

  const handleDeleteIngredient = (id: string) => {
    setIngredients((prev) => {
      const remaining = prev.filter((ingredient) => ingredient.id !== id);
      const fallbackId = remaining[0]?.id ?? "";

      setRecipeLines((lines) => {
        if (!fallbackId) {
          return lines.filter((line) => line.ingredientId !== id);
        }

        return lines.map((line) =>
          line.ingredientId === id ? { ...line, ingredientId: fallbackId } : line
        );
      });

      return remaining;
    });
  };

  const handleAddLine = () => {
    const defaultIngredient = ingredients[0]?.id ?? "";
    setRecipeLines((prev) => [
      ...prev,
      { id: crypto.randomUUID(), ingredientId: defaultIngredient, quantity: "0" },
    ]);
  };

  const handleChangeLine = (id: string, patch: Partial<RecipeLineInput>) => {
    setRecipeLines((prev) => prev.map((line) => (line.id === id ? { ...line, ...patch } : line)));
  };

  const handleRemoveLine = (id: string) => {
    setRecipeLines((prev) => prev.filter((line) => line.id !== id));
  };

  const handleModeChange = (nextMode: "basic" | "advanced") => {
    setMode(nextMode);
    if (nextMode === "basic") {
      setValues((prev) => ({
        ...prev,
        decorationComplexity:
          prev.decorationComplexity === "very_complex" ? "advanced" : prev.decorationComplexity,
      }));
    }
  };

  return (
    <main className="mx-auto flex min-h-screen max-w-6xl flex-col gap-8 px-4 pb-12 pt-10 sm:px-6 lg:px-10">
      <section className="rounded-3xl bg-gradient-to-br from-brand-cream via-white to-brand-peach/30 p-7 shadow-card ring-1 ring-slate-100 backdrop-blur sm:p-10">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
          <div className="space-y-3">
            <p className="text-xs uppercase tracking-wide text-slate-500">{copy.general.tagline}</p>
            <h1 className="text-3xl font-black text-brand-slate sm:text-4xl">{copy.general.appTitle}</h1>
            <p className="max-w-2xl text-sm leading-relaxed text-slate-600">
              {copy.general.tagline}{" "}
              <code className="mx-1 rounded bg-slate-100 px-1">src/lib/pricing.ts</code>{" "}
              <code className="mx-1 rounded bg-slate-100 px-1">src/lib/ingredients.ts</code>.
            </p>
          </div>
          <div className="flex flex-col items-end gap-3 self-start">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/70 px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-slate-600 ring-1 ring-brand-peach/60">
              <span>{copy.languageToggle.label}</span>
              <button
                type="button"
                onClick={() => setLanguage("es")}
                className={`rounded-full px-2 py-1 text-xs font-bold ${language === "es" ? "bg-brand-rose text-brand-slate shadow" : "hover:bg-slate-100"}`}
              >
                ES
              </button>
              <button
                type="button"
                onClick={() => setLanguage("en")}
                className={`rounded-full px-2 py-1 text-xs font-bold ${language === "en" ? "bg-brand-rose text-brand-slate shadow" : "hover:bg-slate-100"}`}
              >
                EN
              </button>
            </div>
            <div className="flex items-center gap-3 self-start rounded-full bg-brand-peach/50 px-4 py-2 text-xs font-semibold text-brand-slate shadow-sm ring-1 ring-white/60">
              📱 {copy.general.mobileFriendly}
            </div>
          </div>
        </div>
      </section>

      <section className="rounded-3xl border border-slate-100 bg-gradient-to-r from-brand-cream via-white to-brand-peach/30 p-6 shadow-card backdrop-blur sm:flex sm:items-center sm:justify-between sm:p-7">
        <div className="space-y-2">
          <p className="text-xs uppercase tracking-wide text-slate-500">{copy.download.label}</p>
          <h2 className="text-lg font-bold text-brand-slate">{copy.download.title}</h2>
          <p className="max-w-3xl text-sm leading-relaxed text-slate-600">
            {copy.download.description}
          </p>
        </div>
        <a
          className="mt-4 inline-flex items-center justify-center rounded-full bg-brand-slate px-4 py-2 text-sm font-semibold text-white shadow-lg transition hover:-translate-y-0.5 hover:bg-brand-slate/90 sm:mt-0"
          href="/cake-pricing-app.zip"
          download
        >
          {copy.download.button}
        </a>
      </section>

      <section className="rounded-3xl border border-slate-100 bg-white/80 p-6 shadow-card backdrop-blur sm:flex sm:items-center sm:justify-between sm:p-7">
        <div className="space-y-2">
          <p className="text-xs uppercase tracking-wide text-slate-500">{copy.modes.label}</p>
          <h2 className="text-lg font-bold text-brand-slate">{copy.modes.title}</h2>
          <p className="max-w-3xl text-sm leading-relaxed text-slate-600">
            {copy.modes.description}
          </p>
        </div>
        <div className="mt-4 inline-flex rounded-full border border-slate-200 bg-white p-1 text-sm font-semibold text-brand-slate shadow-sm sm:mt-0">
          <button
            type="button"
            className={`rounded-full px-4 py-2 transition ${
              mode === "basic" ? "bg-brand-slate text-white shadow" : "hover:bg-slate-100"
            }`}
            onClick={() => handleModeChange("basic")}
          >
            {copy.modes.basic}
          </button>
          <button
            type="button"
            className={`rounded-full px-4 py-2 transition ${
              mode === "advanced" ? "bg-brand-rose text-brand-slate shadow" : "hover:bg-slate-100"
            }`}
            onClick={() => handleModeChange("advanced")}
          >
            {copy.modes.advanced}
          </button>
        </div>
      </section>

      {mode === "advanced" ? (
        <section className="space-y-4">
          <IngredientManager
            ingredients={ingredients}
            onAdd={handleAddIngredient}
            onUpdate={handleUpdateIngredient}
            onDelete={handleDeleteIngredient}
          />
          <RecipeBuilder
            ingredients={ingredients}
            lines={recipeLines}
            onAddLine={handleAddLine}
            onChangeLine={handleChangeLine}
            onRemoveLine={handleRemoveLine}
            lineCosts={recipeCost.lines}
            totalCost={recipeCost.total}
          />
        </section>
      ) : (
        <section className="rounded-3xl border border-dashed border-slate-200 bg-slate-50 p-5 text-sm text-slate-600 shadow-inner">
          <p className="font-semibold text-brand-slate">{copy.basicIntro.title}</p>
          <p className="mt-1">{copy.basicIntro.body}</p>
        </section>
      )}

      <section className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <CalculatorForm
            mode={mode}
            values={values}
            onChange={(field, value) => setValues((prev) => ({ ...prev, [field]: value }))}
            onSubmit={() => setHasCalculated(true)}
          />
        </div>
        <div className="lg:col-span-1 space-y-3">
          <ResultCard pricing={pricing} servings={selectedSize.servings} />
          {/* === SELECTOR DE FOTO PARA TARJETA CLIENTE === */}
<div className="mt-4 space-y-2">
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
      reader.onload = () => {
        setClientPhoto(reader.result as string);
      };
      reader.readAsDataURL(file);
    }}
  />
</div>
          
          {/* === TARJETA CLIENTE (VISTA LIMPIA) === */}
{pricing.recommendedPrice > 0 ? (
  <div className="mt-6 rounded-3xl border border-slate-200 bg-white p-6 shadow-lg">
    {clientPhoto ? (
      <img
        src={clientPhoto}
        alt="Foto del pastel"
        className="mb-4 aspect-square w-full rounded-xl object-cover"
      />
    ) : null}

    <h3 className="text-xl font-black text-brand-slate">
      Presupuesto de pastel
    </h3>

    <p className="mt-1 text-sm text-slate-500">
      {selectedSize.servings} porciones
    </p>

    <div className="mt-4 rounded-2xl bg-brand-cream/40 p-4 text-center">
      <p className="text-xs uppercase tracking-wide text-slate-500">
        Total
      </p>
      <p className="text-3xl font-black text-brand-slate">
        ${pricing.recommendedPrice.toFixed(2)}
      </p>
    </div>

    {pricing.deliveryFee > 0 ? (
      <div className="mt-3 flex justify-between text-sm text-slate-600">
        <span>Delivery</span>
        <span>${pricing.deliveryFee.toFixed(2)}</span>
      </div>
    ) : null}

    <div className="mt-4 rounded-xl bg-slate-50 p-3 text-xs text-slate-600 leading-relaxed">
      Para reservar la fecha del pastel debe abonarse el 50%.
      El saldo restante se paga antes de la entrega.
    </div>
  </div>
) : null}
          <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-4 text-xs leading-relaxed text-slate-600">
            <p className="font-semibold text-brand-slate">{copy.recipeInfo.title}</p>
            <ul className="mt-2 space-y-1 list-disc pl-4">
              {copy.recipeInfo.items.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
          
          <ProFeatures />
          {!hasCalculated ? (
            <p className="text-xs text-slate-500">
              {copy.recipeInfo.cta}
            </p>
          ) : null}
        </div>
     </section>
    </main>
  );
}
