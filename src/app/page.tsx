"use client";

import { CalculatorForm, type CalculatorFormState } from "@/components/CalculatorForm";
import { IngredientManager } from "@/components/IngredientManager";
import { RecipeBuilder, type RecipeLineInput } from "@/components/RecipeBuilder";
import { ResultCard } from "@/components/ResultCard";
import { ProFeatures } from "@/components/ProFeatures";
import { CAKE_SIZES, calculatePricing } from "@/lib/pricing";
import { useMemo, useState } from "react";
import { buildIngredient, calculateRecipeCost, type Ingredient, type RecipeLine } from "@/lib/ingredients";

const DEFAULT_STATE: CalculatorFormState = {
  cakeSize: CAKE_SIZES[1].id,
  basicIngredientsCost: "45",
  decorationCost: "20",
  hoursWorked: "4",
  hourlyRate: "30",
  setupHours: "1",
  setupRate: "30",
  profitMargin: "30",
  deliveryFee: "0",
  decorationComplexity: "intermediate",
  cakeTopper: "0",
  sugarFlowers: "0",
  freshFlowers: "0",
  figures3d: "0",
};

const DEFAULT_INGREDIENTS: Ingredient[] = [
  buildIngredient({ id: "flour", name: "All-purpose flour", unit: "g", packageSize: 1000, packageCost: 3.8 }),
  buildIngredient({ id: "sugar", name: "Caster sugar", unit: "g", packageSize: 1000, packageCost: 2.6 }),
  buildIngredient({ id: "butter", name: "Unsalted butter", unit: "g", packageSize: 454, packageCost: 4.5 }),
  buildIngredient({ id: "eggs", name: "Eggs", unit: "unit", packageSize: 12, packageCost: 4.2 }),
];

export default function HomePage() {
  const [mode, setMode] = useState<"basic" | "advanced">("basic");
  const [values, setValues] = useState<CalculatorFormState>(DEFAULT_STATE);
  const [hasCalculated, setHasCalculated] = useState<boolean>(false);
  const [ingredients, setIngredients] = useState<Ingredient[]>(DEFAULT_INGREDIENTS);
  const [recipeLines, setRecipeLines] = useState<RecipeLineInput[]>([
    { id: "line-1", ingredientId: DEFAULT_INGREDIENTS[0].id, quantity: "300" },
    { id: "line-2", ingredientId: DEFAULT_INGREDIENTS[2].id, quantity: "200" },
  ]);

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
      ? recipeCost.total
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
    <main className="mx-auto flex min-h-screen max-w-6xl flex-col gap-6 px-4 pb-10 pt-10 sm:px-6 lg:px-10">
      <section className="rounded-3xl bg-white/80 p-6 shadow-card ring-1 ring-slate-100 backdrop-blur sm:p-10">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="space-y-2">
            <p className="text-xs uppercase tracking-wide text-slate-500">MVP, mobile-first</p>
            <h1 className="text-3xl font-black text-brand-slate sm:text-4xl">Cake Pricing Calculator</h1>
            <p className="max-w-2xl text-sm text-slate-600">
              Switch between a quick Basic quote and an ingredient-level Advanced view. Pricing logic lives in
              <code className="rounded bg-slate-100 px-1">src/lib/pricing.ts</code> and ingredient math in
              <code className="rounded bg-slate-100 px-1">src/lib/ingredients.ts</code> so you can tweak formulas easily.
            </p>
          </div>
          <div className="flex items-center gap-3 self-start rounded-full bg-brand-rose/20 px-4 py-2 text-xs font-semibold text-brand-slate">
            📱 Mobile friendly
          </div>
        </div>
      </section>

      <section className="rounded-3xl border border-slate-100 bg-gradient-to-r from-brand-rose/10 via-white to-brand-rose/10 p-5 shadow-card backdrop-blur sm:flex sm:items-center sm:justify-between sm:p-6">
        <div className="space-y-1">
          <p className="text-xs uppercase tracking-wide text-slate-500">Download</p>
          <h2 className="text-lg font-bold text-brand-slate">Grab the full project as a ZIP</h2>
          <p className="max-w-3xl text-sm text-slate-600">
            Use this button to download <code className="rounded bg-slate-100 px-1">cake-pricing-app.zip</code> directly—no terminal commands needed. It includes all source files, configs, and assets so you can run it locally or deploy to Vercel.
          </p>
        </div>
        <a
          className="mt-4 inline-flex items-center justify-center rounded-full bg-brand-slate px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-brand-slate/90 sm:mt-0"
          href="/cake-pricing-app.zip"
          download
        >
          ⬇️ Download project ZIP
        </a>
      </section>

      <section className="rounded-3xl border border-slate-100 bg-white/70 p-5 shadow-card backdrop-blur sm:flex sm:items-center sm:justify-between sm:p-6">
        <div className="space-y-1">
          <p className="text-xs uppercase tracking-wide text-slate-500">Choose your view</p>
          <h2 className="text-lg font-bold text-brand-slate">Basic or Advanced mode</h2>
          <p className="max-w-3xl text-sm text-slate-600">
            Basic is perfect for quick quotes with a single ingredient total. Advanced unlocks ingredient-by-quantity pricing,
            extras, delivery, and setup while keeping PRO features visible but locked.
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
            Basic (default)
          </button>
          <button
            type="button"
            className={`rounded-full px-4 py-2 transition ${
              mode === "advanced" ? "bg-brand-rose text-brand-slate shadow" : "hover:bg-slate-100"
            }`}
            onClick={() => handleModeChange("advanced")}
          >
            Advanced
          </button>
        </div>
      </section>

      {mode === "advanced" ? (
        <section className="space-y-4">
          <IngredientManager ingredients={ingredients} onAdd={handleAddIngredient} />
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
          <p className="font-semibold text-brand-slate">Quick quotes without the fuss</p>
          <p className="mt-1">
            Basic mode hides ingredient-by-ingredient inputs. Enter a single ingredient total below and switch to Advanced any
            time to build recipes, add delivery fees, or capture setup hours.
          </p>
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
          <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-4 text-xs leading-relaxed text-slate-600">
            <p className="font-semibold text-brand-slate">How ingredient costs are calculated</p>
            <ul className="mt-2 space-y-1 list-disc pl-4">
              <li>Each ingredient stores a package size and cost. Cost per base unit is auto-calculated.</li>
              <li>Recipe cost multiplies the unit cost by the quantity you use for this cake.</li>
              <li>Decoration complexity multiplies decoration materials + extras + labor so ornate work is covered.</li>
            </ul>
          </div>
          <ProFeatures />
          {!hasCalculated ? (
            <p className="text-xs text-slate-500">
              Update any field and press <strong>Calculate price</strong> to lock in the numbers.
            </p>
          ) : null}
        </div>
      </section>
    </main>
  );
}
