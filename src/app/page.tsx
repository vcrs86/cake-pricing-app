"use client";

import {
  CalculatorForm,
  type CalculatorFormState,
} from "@/components/CalculatorForm";
import { IngredientManager } from "@/components/IngredientManager";
import {
  RecipeBuilder,
  type RecipeLineInput,
} from "@/components/RecipeBuilder";
import { ResultCard } from "@/components/ResultCard";
import { ProFeatures } from "@/components/ProFeatures";
import { CAKE_SIZES, calculatePricing } from "@/lib/pricing";
import {
  buildIngredient,
  calculateRecipeCost,
  type Ingredient,
  type RecipeLine,
} from "@/lib/ingredients";
import { useLanguage } from "@/lib/i18n";
import { BRANDING } from "@/lib/branding";
import { useMemo, useState, useEffect } from "react";
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
type SavedRecipe = {
  id: string;
  name: string;
  cakeSize: string;
  ingredients: Ingredient[];
  recipeLines: RecipeLineInput[];
  createdAt: string;
};
type SavedQuote = {
  id: string;
  name: string;
  createdAt: string;
  currency: string;
  servings: number;
  recipeName?: string;

  ingredients: Ingredient[];
  recipeLines: RecipeLineInput[];

  values: CalculatorFormState;

  pricing: {
    recommended: number;
    delivery: number;
    perServing: number;
  };
};
export default function HomePage() {
  const { copy, language, setLanguage } = useLanguage();
  const formatCurrency = (value: number) => {
    const localeMap: Record<string, string> = {
      USD: "en-US",
      EUR: "es-ES",
      MXN: "es-MX",
      COP: "es-CO",
      ARS: "es-AR",
    };

    const locale = localeMap[currency] || "en-US";

    const formatted = new Intl.NumberFormat(locale, {
      style: "currency",
      currency,
      currencyDisplay: "symbol",
      minimumFractionDigits: currency === "COP" ? 0 : 2,
      maximumFractionDigits: currency === "COP" ? 0 : 2,
    }).format(value);

    return `${currency} ${formatted}`;
  };

  const proCopy = copy.pro;
  const [mode, setMode] = useState<"basic" | "advanced">("basic");
  const [values, setValues] = useState<CalculatorFormState>(DEFAULT_STATE);
  const [hasCalculated, setHasCalculated] = useState<boolean>(false);
  const [ingredients, setIngredients] =
    useState<Ingredient[]>(DEFAULT_INGREDIENTS);
  const [recipeLines, setRecipeLines] = useState<RecipeLineInput[]>([]);
  // --- PUENTE DE DATOS ---
  // Este bloque permite que la receta encuentre la información (precio/peso)
  // de cada ingrediente que guardaste arriba.
  const ingredientLookup = useMemo(() => {
    const map = new Map();
    (ingredients || []).forEach((ing) => {
      map.set(ing.id, ing);
    });
    return map;
  }, [ingredients]);

    const lineCosts = useMemo(() => {
    return recipeLines.map((line) => {
      const ingredient = ingredientLookup.get(line.ingredientId);
      
      // Si no hay ingrediente, enviamos datos vacíos pero con la estructura correcta
      if (!ingredient) {
        return { 
          lineId: line.id, 
          total: 0,
          ingredientName: "",
          unit: "g",
          quantity: 0,
          cost: 0 
        };
      }

      const qty = Number(line.quantity) || 0;
      const price = Number(ingredient.price || (ingredient as any).packageCost || 0);
      const size = Number(ingredient.baseQuantity || (ingredient as any).packageSize || 1);
      const total = (qty / size) * price;

      // Devolvemos el objeto EXACTAMENTE como lo pide el error de Vercel
      return {
        lineId: line.id,
        total: total,
        ingredientName: ingredient.name,
        unit: ingredient.unit,
        quantity: qty,
        cost: total // Vercel pide 'cost', así que le pasamos el mismo total
      };
    });
  }, [ingredientLookup, recipeLines]);

  // --- TOTAL GENERAL ---
  const totalIngredientsCost = useMemo(() => {
    return lineCosts.reduce((acc, curr) => acc + curr.total, 0);
  }, [lineCosts]);

  const [showSavedRecipes, setShowSavedRecipes] = useState(false);
  const [editingQuoteId, setEditingQuoteId] = useState<string | null>(null);
  const [isEditingQuote, setIsEditingQuote] = useState(false);
  const [editingRecipeId, setEditingRecipeId] = useState<string | null>(null);
  const [recipeSearchTerm, setRecipeSearchTerm] = useState("");
  const [clientPhoto, setClientPhoto] = useState<string | null>(null);
  // PRO – Recipes
  const [recipeName, setRecipeName] = useState("");
  const [savedRecipes, setSavedRecipes] = useState<SavedRecipe[]>([]);
  // PRO – Quotes
  const [quoteName, setQuoteName] = useState("");
  const [savedQuotes, setSavedQuotes] = useState<SavedQuote[]>([]);
  const handleUseQuote = (quote: SavedQuote) => {
    setIngredients(quote.ingredients);
    setRecipeLines(quote.recipeLines);

    // 🔴 ESTE ES EL CAMBIO CLAVE
    setValues(quote.values);

    setCurrency(quote.currency);
    setQuoteName(quote.name);

    // 🔄 asegurarse de NO estar editando
    setIsEditingQuote(false);
    setEditingQuoteId(null);
  };
  const handleEditQuote = (quote: SavedQuote) => {
    setIngredients(quote.ingredients);
    setRecipeLines(quote.recipeLines);

    // 🔴 ESTE ES EL CAMBIO CLAVE
    setValues(quote.values);

    setCurrency(quote.currency);
    setQuoteName(quote.name);

    setEditingQuoteId(quote.id);
    setIsEditingQuote(true);
  };

  const [clientMessage, setClientMessage] = useState(
    copy.client.quickMessagePresets[0],
  );
  useEffect(() => {
    setClientMessage(copy.client.quickMessagePresets[0]);
  }, [language]);
  // LOAD SAVED RECIPES (PRO)
  useEffect(() => {
    if (typeof window === "undefined") return;

    const stored = localStorage.getItem("cakeAppSavedRecipes");
    if (!stored) return;

    try {
      setSavedRecipes(JSON.parse(stored));
    } catch {
      localStorage.removeItem("cakeAppSavedRecipes");
    }
  }, []);
  useEffect(() => {
    if (typeof window === "undefined") return;

    const stored = localStorage.getItem("cakeAppSavedQuotes");
    if (!stored) return;

    try {
      setSavedQuotes(JSON.parse(stored));
    } catch {
      localStorage.removeItem("cakeAppSavedQuotes");
    }
  }, []);
  useEffect(() => {
    if (typeof window === "undefined") return;

    localStorage.setItem("cakeAppSavedQuotes", JSON.stringify(savedQuotes));
  }, [savedQuotes]);

  // SAVE SAVED RECIPES (PRO)
  useEffect(() => {
    if (typeof window === "undefined") return;

    localStorage.setItem("cakeAppSavedRecipes", JSON.stringify(savedRecipes));
  }, [savedRecipes]);
  // Estado para la búsqueda de recetas

  // Esta variable crea la lista filtrada automáticamente
  const filteredRecipes = savedRecipes.filter((recipe) =>
    recipe.name.toLowerCase().includes(recipeSearchTerm.toLowerCase()),
  );

  const [activeTab, setActiveTab] = useState<
    "calculator" | "client" | "brand" | "pro"
  >("calculator");

  const [businessName, setBusinessName] = useState("");
  const [businessLogo, setBusinessLogo] = useState<string | null>(null);

  const [isPro, setIsPro] = useState(false);

  // PRO – Energy cost (oven)
  const [ovenKwh, setOvenKwh] = useState(0);
  const [ovenHours, setOvenHours] = useState(0);
  const [energyRate, setEnergyRate] = useState(0);

  // PRO – Rent cost
  const [monthlyRent, setMonthlyRent] = useState(0);
  const [workDaysPerMonth, setWorkDaysPerMonth] = useState(0);
  const [daysUsedForOrder, setDaysUsedForOrder] = useState(0);

  // PRO – Utilities cost
  const [monthlyUtilities, setMonthlyUtilities] = useState(0);
  const [utilityWorkDaysPerMonth, setUtilityWorkDaysPerMonth] = useState(0);
  const [utilityDaysUsedForOrder, setUtilityDaysUsedForOrder] = useState(0);

  // PRO – Marketing cost
  const [monthlyMarketing, setMonthlyMarketing] = useState(0);
  const [ordersPerMonth, setOrdersPerMonth] = useState(0);

  // PRO – Include operational costs
  const [includeProCosts, setIncludeProCosts] = useState(false);
  // PRO – Currency
  const [currency, setCurrency] = useState("USD");

  /* =========================
   LOAD PRO STATE (ON MOUNT)
========================= */
  useEffect(() => {
    if (typeof window === "undefined") return;

    const saved = window.localStorage.getItem("cakeAppProState");
    if (!saved) return;

    try {
      const data = JSON.parse(saved);

      setIsPro(!!data.isPro);
      setIncludeProCosts(!!data.includeProCosts);
      setCurrency(data.currency || "USD");

      setOvenKwh(Number(data.ovenKwh) || 0);
      setOvenHours(Number(data.ovenHours) || 0);
      setEnergyRate(Number(data.energyRate) || 0);

      setMonthlyRent(Number(data.monthlyRent) || 0);
      setWorkDaysPerMonth(Number(data.workDaysPerMonth) || 0);
      setDaysUsedForOrder(Number(data.daysUsedForOrder) || 0);

      setMonthlyUtilities(Number(data.monthlyUtilities) || 0);
      setUtilityWorkDaysPerMonth(Number(data.utilityWorkDaysPerMonth) || 0);
      setUtilityDaysUsedForOrder(Number(data.utilityDaysUsedForOrder) || 0);

      setMonthlyMarketing(Number(data.monthlyMarketing) || 0);
      setOrdersPerMonth(Number(data.ordersPerMonth) || 0);
      setBusinessName(data.businessName || "");
      setBusinessLogo(data.businessLogo || null);
    } catch (e) {
      console.warn("Invalid PRO state in localStorage, clearing it");
      window.localStorage.removeItem("cakeAppProState");
    }
  }, []);
  /* =========================
   LOAD BRAND STATE (ON MOUNT)
========================= */
  useEffect(() => {
    if (typeof window === "undefined") return;

    const saved = window.localStorage.getItem("cakeAppBrandState");
    if (!saved) return;

    try {
      const data = JSON.parse(saved);

      if (typeof data.businessName === "string") {
        setBusinessName(data.businessName);
      }

      if (typeof data.businessLogo === "string") {
        setBusinessLogo(data.businessLogo);
      }
    } catch (e) {
      console.warn("Invalid brand state, clearing it");
      window.localStorage.removeItem("cakeAppBrandState");
    }
  }, []);
  /* =========================
   SAVE PRO STATE (AUTO)
========================= */
  useEffect(() => {
    if (typeof window === "undefined") return;

    try {
      const data = {
        currency,
        isPro,
        includeProCosts,
        businessName,
        businessLogo,
        ovenKwh,
        ovenHours,
        energyRate,
        monthlyRent,
        workDaysPerMonth,
        daysUsedForOrder,
        monthlyUtilities,
        utilityWorkDaysPerMonth,
        utilityDaysUsedForOrder,
        monthlyMarketing,
        ordersPerMonth,
      };

      window.localStorage.setItem("cakeAppProState", JSON.stringify(data));
    } catch (e) {
      console.warn("Could not save PRO state", e);
    }
  }, [
    currency,
    isPro,
    includeProCosts,
    businessName,
    businessLogo,
    ovenKwh,
    ovenHours,
    energyRate,
    monthlyRent,
    workDaysPerMonth,
    daysUsedForOrder,
    monthlyUtilities,
    utilityWorkDaysPerMonth,
    utilityDaysUsedForOrder,
    monthlyMarketing,
    ordersPerMonth,
  ]);
  /* =========================
   SAVE BRAND STATE (AUTO)
========================= */
  useEffect(() => {
    if (typeof window === "undefined") return;

    try {
      const data = {
        businessName,
        businessLogo,
      };

      window.localStorage.setItem("cakeAppBrandState", JSON.stringify(data));
    } catch (e) {
      console.warn("Could not save brand state", e);
    }
  }, [businessName, businessLogo]);
  /* =========================
   SAVE BRAND STATE (AUTO)
========================= */
  useEffect(() => {
    if (typeof window === "undefined") return;

    try {
      const data = {
        businessName,
        businessLogo,
      };

      window.localStorage.setItem("cakeAppBrandState", JSON.stringify(data));
    } catch (e) {
      console.warn("Could not save brand state", e);
    }
  }, [businessName, businessLogo]);

  /* =========================
   PRO COST CALCULATIONS
========================= */
  const ovenEnergyCost = useMemo(() => {
    if (!isPro) return 0;
    return ovenKwh * ovenHours * energyRate;
  }, [isPro, ovenKwh, ovenHours, energyRate]);

  const rentCostPerOrder = useMemo(() => {
    if (!isPro || workDaysPerMonth === 0) return 0;
    return (monthlyRent / workDaysPerMonth) * daysUsedForOrder;
  }, [isPro, monthlyRent, workDaysPerMonth, daysUsedForOrder]);

  const utilitiesCostPerOrder = useMemo(() => {
    if (!isPro || utilityWorkDaysPerMonth === 0) return 0;
    return (
      (monthlyUtilities / utilityWorkDaysPerMonth) * utilityDaysUsedForOrder
    );
  }, [
    isPro,
    monthlyUtilities,
    utilityWorkDaysPerMonth,
    utilityDaysUsedForOrder,
  ]);

  const marketingCostPerOrder = useMemo(() => {
    if (!isPro || ordersPerMonth === 0) return 0;
    return monthlyMarketing / ordersPerMonth;
  }, [isPro, monthlyMarketing, ordersPerMonth]);

  const totalProOperationalCost = useMemo(() => {
    if (!isPro || !includeProCosts) return 0;

    return (
      ovenEnergyCost +
      rentCostPerOrder +
      utilitiesCostPerOrder +
      marketingCostPerOrder
    );
  }, [
    isPro,
    includeProCosts,
    ovenEnergyCost,
    rentCostPerOrder,
    utilitiesCostPerOrder,
    marketingCostPerOrder,
  ]);
  const selectedSize = useMemo(
    () =>
      CAKE_SIZES.find((size) => size.id === values.cakeSize) ?? CAKE_SIZES[0],
    [values.cakeSize],
  );

  const recipeLineNumbers: RecipeLine[] = useMemo(
    () =>
      recipeLines.map((line) => ({
        id: line.id,
        ingredientId: line.ingredientId,
        quantity: Number(line.quantity) || 0,
      })),
    [recipeLines],
  );

  const recipeCost = useMemo(
    () => calculateRecipeCost(ingredients, recipeLineNumbers),
    [ingredients, recipeLineNumbers],
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

  const decorationCostValue =
    mode === "advanced" ? Number(values.decorationCost) || 0 : 0;
  const setupHoursValue =
    mode === "advanced" ? Number(values.setupHours) || 0 : 0;
  const setupRateValue =
    mode === "advanced" ? Number(values.setupRate) || 0 : 0;
  const deliveryFeeValue =
    mode === "advanced" ? Number(values.deliveryFee) || 0 : 0;

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
    ],
  );

  const handleAddIngredient = (ingredient: Ingredient) => {
    setIngredients((prev) => [...prev, ingredient]);
  };

  const handleUpdateIngredient = (
    id: string,
    patch: Partial<
      Pick<Ingredient, "name" | "unit" | "packageSize" | "packageCost">
    >,
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
          : ingredient,
      ),
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
          line.ingredientId === id
            ? { ...line, ingredientId: fallbackId }
            : line,
        );
      });

      return remaining;
    });
  };

  const handleAddLine = () => {
    const defaultIngredient = ingredients[0]?.id ?? "";
    setRecipeLines((prev) => [
      ...prev,
      {
        id: crypto.randomUUID(),
        ingredientId: defaultIngredient,
        quantity: "0",
      },
    ]);
  };

  const handleChangeLine = (id: string, patch: Partial<RecipeLineInput>) => {
    setRecipeLines((prev) =>
      prev.map((line) => (line.id === id ? { ...line, ...patch } : line)),
    );
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
          prev.decorationComplexity === "very_complex"
            ? "advanced"
            : prev.decorationComplexity,
      }));
    }
  };

  const finalPricing = useMemo(() => {
  // Precio base calculado por la app
  let finalRecommended = pricing.recommendedPrice;

  // Si es PRO y se incluyen costos operativos, los sumamos
  if (isPro && includeProCosts) {
    finalRecommended += totalProOperationalCost;
  }

  return {
    ...pricing,
    recommendedPrice: finalRecommended,
    perServing:
      selectedSize.servings > 0
        ? finalRecommended / selectedSize.servings
        : 0,
  };
}, [
  pricing,
  isPro,
  includeProCosts,
  totalProOperationalCost,
  selectedSize.servings,
]);

  return (
    <main className="no-print mx-auto flex min-h-screen max-w-6xl flex-col gap-8 px-4 pb-12 pt-10 sm:px-6 lg:px-10">
      <section className="relative overflow-hidden rounded-3xl bg-white/60 backdrop-blur-xl shadow-xl ring-1 ring-white/40 p-7 sm:p-10">
        {/* Decorative blobs */}
        <div className="pointer-events-none absolute -top-24 -right-24 h-72 w-72 rounded-full bg-brand-rose/20 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-brand-peach/30 blur-3xl" />

        <div className="relative z-10">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
            {/* LEFT */}
            <div className="space-y-3">
              <h1 className="text-3xl font-black text-brand-slate sm:text-4xl">
                {copy.general.appTitle}
              </h1>

              <p className="max-w-2xl text-sm leading-relaxed text-slate-600">
                {copy.general.tagline}
              </p>
            </div>

            {/* RIGHT */}
            <div className="flex flex-col items-end gap-3 self-start">
              <div className="inline-flex items-center gap-2 rounded-full bg-white/70 px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-slate-600 ring-1 ring-brand-peach/60">
                <span>{copy.languageToggle.label}</span>

                <button
                  type="button"
                  onClick={() => setLanguage("es")}
                  className={`rounded-full px-2 py-1 text-xs font-bold ${
                    language === "es"
                      ? "bg-brand-rose text-brand-slate shadow"
                      : "hover:bg-slate-100"
                  }`}
                >
                  ES
                </button>

                <button
                  type="button"
                  onClick={() => setLanguage("en")}
                  className={`rounded-full px-2 py-1 text-xs font-bold ${
                    language === "en"
                      ? "bg-brand-rose text-brand-slate shadow"
                      : "hover:bg-slate-100"
                  }`}
                >
                  EN
                </button>
              </div>

              <div className="flex items-center gap-3 self-start rounded-full bg-brand-peach/50 px-4 py-2 text-xs font-semibold text-brand-slate shadow-sm ring-1 ring-white/60">
                📱 {copy.general.mobileFriendly}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* MODE */}
      <section className="rounded-3xl border border-slate-100 bg-white/80 p-6 shadow-card backdrop-blur sm:flex sm:items-center sm:justify-between sm:p-7">
        <div className="space-y-2">
          <p className="text-xs uppercase tracking-wide text-slate-500">
            {copy.modes.label}
          </p>
          <h2 className="text-lg font-bold text-brand-slate">
            {copy.modes.title}
          </h2>
          <p className="max-w-3xl text-sm leading-relaxed text-slate-600">
            {copy.modes.description}
          </p>
        </div>

        <div className="mt-4 inline-flex rounded-full border border-slate-200 bg-white p-1 text-sm font-semibold text-brand-slate shadow-sm sm:mt-0">
          <button
            type="button"
            className={`rounded-full px-4 py-2 transition ${
              mode === "basic"
                ? "bg-brand-slate text-white shadow"
                : "hover:bg-slate-100"
            }`}
            onClick={() => handleModeChange("basic")}
          >
            {copy.modes.basic}
          </button>
          <button
            type="button"
            className={`rounded-full px-4 py-2 transition ${
              mode === "advanced"
                ? "bg-brand-rose text-brand-slate shadow"
                : "hover:bg-slate-100"
            }`}
            onClick={() => handleModeChange("advanced")}
          >
            {copy.modes.advanced}
          </button>
        </div>
        {/* Currency selector */}
        <div className="mt-4 max-w-xs">
          <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">
            {copy.currency.label}
          </label>

          <select
            value={currency}
            onChange={(e) => setCurrency(e.target.value)}
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm"
          >
            <option value="USD">{copy.currency.options.usd}</option>
            <option value="EUR">{copy.currency.options.eur}</option>
            <option value="MXN">{copy.currency.options.mxn}</option>
            <option value="COP">{copy.currency.options.cop}</option>
            <option value="ARS">{copy.currency.options.ars}</option>
          </select>
        </div>
      </section>
      {/* MODE EXPLANATION */}
      <section className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-5 text-sm text-slate-600 shadow-inner">
        {mode === "basic" ? (
          <>
            <p className="font-semibold text-brand-slate">
              {copy.modes.basicTitle}
            </p>
            <p className="mt-1">{copy.modes.basicDescription}</p>
          </>
        ) : (
          <>
            <p className="font-semibold text-brand-slate">
              {copy.modes.advancedTitle}
            </p>
            <p className="mt-1">{copy.modes.advancedDescription}</p>
          </>
        )}
      </section>

      {/* --- INICIO DEL BLOQUE RECUPERADO --- */}
      {mode === "advanced" && (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
          {/* 1. GESTOR DE INGREDIENTES */}
          <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
            <div className="mb-6">
              <h3 className="text-xl font-bold text-brand-slate">
                🍎 {copy.ingredientManager?.title || "Costos base"}
              </h3>
              <p className="text-sm text-slate-500">
                {copy.ingredientManager?.helper ||
                  "Los ingredientes son editables y deben reflejar tus costos reales."}
              </p>
            </div>

            <IngredientManager
              ingredients={ingredients}
              onAdd={(newIng) => setIngredients((prev) => [...prev, newIng])}
              onUpdate={(id, patch) =>
                setIngredients((prev) =>
                  prev.map((ing) =>
                    ing.id === id ? { ...ing, ...patch } : ing,
                  ),
                )
              }
              onDelete={handleDeleteIngredient}
              formatCurrency={formatCurrency}
              copy={copy}
              currency={currency}
            />
          </section>

          {/* 2. CONSTRUCTOR DE RECETA */}
          <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
            <div className="mb-6">
              <h3 className="text-xl font-bold text-brand-slate">
                🥣 {copy.recipeBuilder?.title || "Costo por receta"}
              </h3>
              <p className="text-sm text-slate-500">
                {copy.recipeBuilder?.empty ||
                  "Agrega ingredientes y cantidades."}
              </p>
            </div>

            <RecipeBuilder
              ingredients={ingredients}
              lines={recipeLines}
              onAddLine={handleAddLine}
              onChangeLine={handleChangeLine}
              onRemoveLine={handleRemoveLine}
              lineCosts={lineCosts}
              totalCost={totalIngredientsCost}
            />
          </section>
        </div>
      )}
      {/* --- FIN DEL BLOQUE RECUPERADO --- */}

      {/* ADVANCED HELPERS */}
      {/* SAVED RECIPES (PRO) */}
      <button
        type="button"
        onClick={() => setShowSavedRecipes((prev) => !prev)}
        className="flex w-full items-center justify-between rounded-xl bg-slate-100 px-4 py-3 text-sm font-semibold text-brand-slate hover:bg-slate-200 transition"
      >
        <span>📚 {copy.recipes.savedListTitle}</span>
        <span>{showSavedRecipes ? "▲" : "▼"}</span>
      </button>

      {showSavedRecipes && (
        <div className="mt-3 space-y-4">
          {/* BARRA DE BÚSQUEDA (Solo si es Pro y tiene recetas) */}
          {isPro && savedRecipes.length > 0 && (
            <div className="relative">
              <input
                type="text"
                value={recipeSearchTerm}
                onChange={(e) => setRecipeSearchTerm(e.target.value)}
                placeholder={
                  copy.recipes?.searchPlaceholder || "Buscar receta..."
                }
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm shadow-sm focus:border-brand-rose focus:ring-1 focus:ring-brand-rose outline-none"
              />
            </div>
          )}

          {!isPro ? (
            <div className="rounded-xl bg-slate-900 p-3 text-center text-xs font-bold uppercase tracking-wide text-white">
              {copy.recipes.proLocked}
            </div>
          ) : filteredRecipes.length === 0 ? (
            <p className="text-center text-sm text-slate-500 py-4">
              {recipeSearchTerm !== ""
                ? copy.recipes?.noResults || "No se encontraron resultados"
                : copy.recipes.empty}
            </p>
          ) : (
            <ul className="space-y-3">
              {filteredRecipes.map((recipe) => (
                <li
                  key={recipe.id}
                  className="rounded-xl border border-slate-200 bg-slate-50 p-4 space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-brand-slate">
                        {recipe.name}
                      </p>
                      <p className="text-xs text-slate-500">
                        {new Date(recipe.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    {/* BOTÓN USAR */}
                    <button
                      type="button"
                      onClick={() => {
                        setIngredients(recipe.ingredients);
                        setRecipeLines(recipe.recipeLines);
                        setValues((prev) => ({
                          ...prev,
                          cakeSize: recipe.cakeSize,
                        }));
                      }}
                      className="flex-1 rounded-lg bg-brand-slate px-3 py-2 text-xs font-semibold text-white hover:shadow"
                    >
                      {copy.recipes.use}
                    </button>

                    {/* BOTÓN EDITAR */}
                    <button
                      type="button"
                      onClick={() => {
                        setIngredients(recipe.ingredients);
                        setRecipeLines(recipe.recipeLines);
                        setValues((prev) => ({
                          ...prev,
                          cakeSize: recipe.cakeSize,
                        }));
                        setEditingRecipeId(recipe.id);
                      }}
                      className="flex-1 rounded-lg border border-brand-slate px-3 py-2 text-xs font-semibold text-brand-slate hover:bg-brand-slate/10"
                    >
                      {copy.recipes.edit}
                    </button>

                    {/* BOTÓN ELIMINAR */}
                    <button
                      type="button"
                      onClick={() => {
                        if (!confirm(copy.recipes.confirmDelete)) return;
                        setSavedRecipes((prev) =>
                          prev.filter((r) => r.id !== recipe.id),
                        );
                      }}
                      className="flex-1 rounded-lg border border-red-300 px-3 py-2 text-xs font-semibold text-red-600 hover:bg-red-50"
                    >
                      {copy.recipes.delete}
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
      {/* SAVE RECIPE (PRO) */}
      <div className="rounded-2xl border border-dashed border-brand-rose/30 bg-brand-rose/10 p-5 space-y-3">
        <h3 className="text-sm font-bold text-brand-slate">
          💾 {copy.recipes.saveTitle}
        </h3>

        <p className="text-xs text-slate-600">{copy.recipes.saveDescription}</p>

        <label className="block text-sm font-semibold text-slate-700">
          {copy.recipes.recipeName}
        </label>

        <input
          type="text"
          value={recipeName}
          onChange={(e) => setRecipeName(e.target.value)}
          placeholder={copy.recipes.recipePlaceholder}
          disabled={!isPro}
          className={`w-full rounded-lg border px-3 py-2 text-sm ${
            isPro
              ? "border-brand-rose bg-white text-slate-700"
              : "border-slate-300 bg-slate-100 text-slate-600 cursor-not-allowed"
          }`}
        />

        <button
          type="button"
          disabled={!isPro}
          onClick={() => {
            const newRecipe = {
              id: crypto.randomUUID(),
              name: recipeName || copy.recipes.unnamed,
              cakeSize: values.cakeSize,
              ingredients,
              recipeLines,
              createdAt: new Date().toISOString(),
            };

            setSavedRecipes((prev) => [newRecipe, ...prev]);
            setRecipeName("");
          }}
          className={`w-full rounded-xl px-4 py-3 text-sm font-semibold transition ${
            isPro
              ? "bg-brand-slate text-white hover:-translate-y-0.5 hover:shadow-lg"
              : "bg-slate-300 text-slate-500 cursor-not-allowed"
          }`}
        >
          {isPro ? copy.recipes.saveButton : copy.recipes.proLocked}
        </button>
      </div>

      {/* TABS */}
      <div className="flex gap-2 rounded-2xl bg-slate-100 p-2">
        <button
          onClick={() => setActiveTab("calculator")}
          className={`flex-1 rounded-xl px-4 py-2 text-sm font-semibold transition ${
            activeTab === "calculator"
              ? "bg-white shadow text-brand-slate"
              : "text-slate-500 hover:bg-white/60"
          }`}
        >
          🧮 {copy.tabs.calculator}
        </button>

        <button
          onClick={() => setActiveTab("client")}
          className={`flex-1 rounded-xl px-4 py-2 text-sm font-semibold transition ${
            activeTab === "client"
              ? "bg-white shadow text-brand-slate"
              : "text-slate-500 hover:bg-white/60"
          }`}
        >
          🎨 {copy.tabs.client}
        </button>

        <button
          onClick={() => setActiveTab("brand")}
          className={`flex-1 rounded-xl px-4 py-2 text-sm font-semibold transition ${
            activeTab === "brand"
              ? "bg-white shadow text-brand-slate"
              : "text-slate-500 hover:bg-white/60"
          }`}
        >
          🏷️ {copy.tabs.brand}
        </button>

        <button
          onClick={() => setActiveTab("pro")}
          className={`flex-1 rounded-xl px-4 py-2 text-sm font-semibold transition ${
            activeTab === "pro"
              ? "bg-white shadow text-brand-slate"
              : "text-slate-500 hover:bg-white/60"
          }`}
        >
          🟣 {copy.tabs.pro}
        </button>
      </div>

      {/* CALCULATOR TAB */}
      {activeTab === "calculator" ? (
        <section className="grid grid-cols-1 gap-6 lg:grid-cols-3 animate-in fade-in slide-in-from-bottom-2 duration-300">
          <div className="lg:col-span-2">
            <CalculatorForm
              mode={mode}
              values={values}
              onChange={(field, value) =>
                setValues((prev) => ({ ...prev, [field]: value }))
              }
              onSubmit={() => setHasCalculated(true)}
            />
          </div>

          <div className="lg:col-span-1 space-y-3">
            <ResultCard
              pricing={finalPricing}
              servings={selectedSize.servings}
              formatCurrency={formatCurrency}
            />
            {/* SAVE QUOTE (PRO) */}
            <div className="rounded-2xl border border-dashed border-brand-rose/30 bg-brand-rose/10 p-5 space-y-3">
              <h3 className="text-sm font-bold text-brand-slate">
                💾 {copy.quotes.saveTitle}
              </h3>

              <input
                type="text"
                value={quoteName}
                onChange={(e) => setQuoteName(e.target.value)}
                placeholder="Ej: Cumpleaños 20 porciones"
                disabled={!isPro}
                className={`w-full rounded-lg border px-3 py-2 text-sm ${
                  isPro
                    ? "border-brand-rose bg-white"
                    : "border-slate-300 bg-slate-100 cursor-not-allowed"
                }`}
              />

              <button
                type="button"
                disabled={!isPro || finalPricing.recommendedPrice <= 0}
                onClick={() => {
                  const newQuote: SavedQuote = {
                    id:
                      isEditingQuote && editingQuoteId
                        ? editingQuoteId
                        : crypto.randomUUID(),
                    name: quoteName || "Presupuesto sin nombre",
                    createdAt: new Date().toISOString(),
                    currency,
                    servings: selectedSize.servings,
                    recipeName: recipeName || undefined,

                    ingredients,
                    recipeLines,
                    values,

                    pricing: {
                      recommended: finalPricing.recommendedPrice,
                      delivery: pricing.deliveryFee,
                      perServing:
                        finalPricing.recommendedPrice / selectedSize.servings,
                    },
                  };
                  setSavedQuotes((prev) => {
                    if (isEditingQuote && editingQuoteId) {
                      return prev.map((q) =>
                        q.id === editingQuoteId ? newQuote : q,
                      );
                    }

                    return [...prev, newQuote];
                  });

                  // 🔄 SALIR DEL MODO EDICIÓN
                  setIsEditingQuote(false);
                  setEditingQuoteId(null);

                  // Limpiar nombre (solo UI)
                  setQuoteName("");
                }}
                className={`w-full rounded-xl px-4 py-3 text-sm font-semibold ${
                  isPro
                    ? "bg-brand-slate text-white hover:-translate-y-0.5 hover:shadow-lg"
                    : "bg-slate-300 text-slate-500 cursor-not-allowed"
                }`}
              >
                {isPro ? copy.quotes.saveButton : copy.client.proBadge}
              </button>
            </div>
            {/* LISTA DE PRESUPUESTOS GUARDADOS (VERSION CON CANDADOS) */}
            {savedQuotes.length > 0 && (
              <div className="rounded-2xl border border-slate-200 bg-white p-5 space-y-4">
                <h3 className="text-sm font-bold text-brand-slate">
                  📋 {copy.quotes.listTitle}
                </h3>

                <div className="space-y-3">
                  {savedQuotes.map((quote) => (
                    <div
                      key={quote.id}
                      className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 p-3"
                    >
                      <div>
                        <p className="text-sm font-semibold text-slate-700">
                          {quote.name}
                        </p>
                        <p className="text-xs text-slate-500">
                          {new Date(quote.createdAt).toLocaleDateString()}
                        </p>
                      </div>

                      <div className="flex gap-2">
                        {/* BOTÓN USAR */}
                        <button
                          disabled={!isPro}
                          onClick={() => handleUseQuote(quote)}
                          className={`rounded-lg px-3 py-1 text-xs font-semibold transition ${
                            isPro
                              ? "bg-brand-slate text-white hover:bg-slate-800"
                              : "bg-slate-200 text-slate-400 cursor-not-allowed"
                          }`}
                        >
                          {isPro
                            ? copy.quotes.useQuote
                            : `🔒 ${copy.quotes.useQuote}`}
                        </button>

                        {/* BOTÓN EDITAR */}
                        <button
                          disabled={!isPro}
                          onClick={() => handleEditQuote(quote)}
                          className={`rounded-lg border px-3 py-1 text-xs font-semibold transition ${
                            isPro
                              ? "border-slate-300 bg-white text-slate-600 hover:bg-slate-50"
                              : "border-slate-200 bg-slate-50 text-slate-400 cursor-not-allowed"
                          }`}
                        >
                          {isPro
                            ? copy.quotes.editQuote
                            : `🔒 ${copy.quotes.editQuote}`}
                        </button>

                        {/* BOTÓN BORRAR */}
                        <button
                          disabled={!isPro}
                          onClick={() => {
                            if (confirm(copy.recipes.confirmDelete)) {
                              setSavedQuotes((prev) =>
                                prev.filter((q) => q.id !== quote.id),
                              );
                            }
                          }}
                          className={`rounded-lg border px-3 py-1 text-xs font-semibold transition ${
                            isPro
                              ? "border-red-300 bg-white text-red-600 hover:bg-red-50"
                              : "border-slate-200 bg-slate-50 text-slate-400 cursor-not-allowed"
                          }`}
                        >
                          {isPro ? copy.quotes.deleteQuote : "🔒"}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="mt-4 space-y-2">
              <label className="block text-sm font-semibold text-slate-700">
                📷 {copy.client.cakePhotoLabel}
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (!file) return;
                  const reader = new FileReader();
                  reader.onload = () => setClientPhoto(reader.result as string);
                  reader.readAsDataURL(file);
                }}
              />
            </div>
          </div>
        </section>
      ) : null}

      {/* CLIENT TAB */}
      {activeTab === "client" ? (
        <section className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
          {/* MENSAJE PARA EL CLIENTE (FREE – SOLO LECTURA) */}
          <div className="relative rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <div className="pointer-events-none absolute inset-0 flex items-center justify-center rounded-2xl bg-white/60">
              <div className="rounded-full bg-slate-900 px-4 py-2 text-[11px] font-bold uppercase tracking-wide text-white shadow">
                {copy.client.proBadge}
              </div>
            </div>

            <label className="mb-1 block text-sm font-semibold text-slate-600">
              ✏️ {copy.client.clientMessageLabel}
            </label>
            <textarea
              value={clientMessage}
              disabled
              rows={3}
              className="w-full resize-none rounded-xl border border-slate-300 bg-slate-100 p-3 text-sm text-slate-600 cursor-not-allowed"
            />
            <p className="mt-1 text-[10px] text-slate-400">
              {copy.client.clientMessageLocked}
            </p>
          </div>

          {/* TARJETA CLIENTE */}
          {pricing.recommendedPrice > 0 ? (
            <div className="quote-print relative mt-6 max-w-[420px] mx-auto rounded-3xl border border-white/60 bg-white/80 p-5 shadow-xl backdrop-blur-xl ring-1 ring-white/70 transition-all duration-300 hover:-translate-y-1">
              <div className="absolute right-3 top-3 rounded-full bg-slate-100 px-3 py-1 text-[11px] font-bold uppercase tracking-wide text-slate-600">
                {copy.client.freeBadge}
              </div>
              {businessLogo && (
  <div className="mb-2 flex justify-center">
    <img
      src={businessLogo}
      alt={businessName || "Brand logo"}
      className="h-10 object-contain print:h-8"
    />
  </div>
)}

{businessName && (
  <p className="mb-2 text-center text-xs font-semibold uppercase tracking-wide text-slate-400">
    {businessName}
  </p>
)}

              {clientPhoto ? (
                <img
                  src={clientPhoto}
                  alt={copy.client.cakePhotoLabel}
                  className="mb-3 aspect-square w-full max-h-[220px] rounded-xl object-cover"
                />
              ) : null}

              <h3 className="text-xl font-black text-brand-slate">
                {copy.client.quoteTitle}
              </h3>

              <p className="mt-1 text-sm text-slate-500">
                {selectedSize.servings} {copy.client.servingsLabel}
              </p>

              <div className="mt-4 rounded-2xl bg-brand-cream/40 p-4 text-center">
                <p className="text-xs uppercase tracking-wide text-slate-500">
                  {copy.client.totalLabel}
                </p>
                <p className="text-3xl font-black text-brand-slate">
                  {formatCurrency(finalPricing.recommendedPrice)}
                </p>
              </div>

              {pricing.deliveryFee > 0 ? (
                <div className="mt-3 flex justify-between text-sm text-slate-600">
                  <span>{copy.client.deliveryLabel}</span>
                  <span>{formatCurrency(pricing.deliveryFee)}</span>
                </div>
              ) : null}

              {clientMessage ? (
                <div className="mt-4 rounded-xl bg-slate-50 p-3 text-xs text-slate-600">
                  {clientMessage}
                </div>
              ) : null}

              {/* FOOTER LEGAL — SOLO PDF */}
              <div className="mt-4 hidden border-t border-slate-200 pt-3 text-[10px] leading-snug text-slate-500 print:block">
                <p>{copy.client.legalNote1}</p>
                <p className="mt-1">{copy.client.legalNote2}</p>
              </div>
            </div>
          ) : null}

          {/* BOTONES PRINT */}
          <button
            type="button"
            onClick={() => {
              const content = document.getElementById("print-only");
              if (!content) return;

              const printWindow = window.open("", "_blank");
              if (!printWindow) return;

              printWindow.document.write(`
      <html>
        <head><title>${copy.client.quoteTitle}</title></head>
        <body>${content.innerHTML}</body>
      </html>
    `);

              printWindow.document.close();
              printWindow.focus();

              setTimeout(() => {
                printWindow.print();
                printWindow.close();
              }, 300);
            }}
            className="mt-4 w-full rounded-xl bg-brand-slate px-4 py-3 text-sm font-semibold text-white transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg"
          >
            📄 {copy.client.printButton}
          </button>

          <button
            type="button"
            onClick={() => {
              const content = document.getElementById("print-only");
              if (!content) return;

              const win = window.open("", "_blank");
              if (!win) return;

              win.document.write(`
                <html>
                  <head><title>Presupuesto</title></head>
                  <body>${content.innerHTML}</body>
                </html>
              `);

              win.document.close();
              win.focus();
            }}
            className="mt-2 w-full rounded-xl border border-brand-slate px-4 py-3 text-sm font-semibold text-brand-slate"
          >
            💾 {copy.client.openPdfButton}
          </button>

          {/* CONTENIDO SOLO PARA IMPRESIÓN */}
          <div id="print-only" style={{ display: "none" }}>
            <div
              style={{
                fontFamily: "Arial, sans-serif",
                maxWidth: "380px",
                margin: "0 auto",
                padding: "16px",
              }}
            >
              {/* BRAND (PDF ONLY) */}
              {businessLogo ? (
                <div style={{ textAlign: "center", marginBottom: "12px" }}>
                  <img
                    src={businessLogo}
                    alt={businessName || "Brand logo"}
                    style={{
                      maxHeight: "40px",
                      objectFit: "contain",
                      margin: "0 auto",
                    }}
                  />
                  {businessName ? (
                    <p
                      style={{
                        marginTop: "6px",
                        fontSize: "11px",
                        fontWeight: "600",
                        letterSpacing: "0.08em",
                        textTransform: "uppercase",
                        color: "#6b7280",
                      }}
                    >
                      {businessName}
                    </p>
                  ) : null}
                </div>
              ) : businessName ? (
                <p
                  style={{
                    textAlign: "center",
                    marginBottom: "14px",
                    fontSize: "12px",
                    fontWeight: "700",
                    letterSpacing: "0.12em",
                    textTransform: "uppercase",
                    color: "#6b7280",
                  }}
                >
                  {businessName}
                </p>
              ) : null}
              {clientPhoto ? (
                <img
                  src={clientPhoto}
                  alt={copy.client.cakePhotoAlt}
                  style={{
                    width: "100%",
                    aspectRatio: "1 / 1",
                    objectFit: "cover",
                    borderRadius: "12px",
                    marginBottom: "12px",
                  }}
                />
              ) : null}

              <h2 style={{ fontSize: "20px", fontWeight: "700" }}>
                {copy.client.quoteTitle}
              </h2>

              <p style={{ fontSize: "14px", marginBottom: "8px" }}>
                {selectedSize.servings} {copy.client.servingsLabel}
              </p>

              <p
                style={{
                  fontSize: "28px",
                  fontWeight: "800",
                  margin: "12px 0",
                }}
              >
                {formatCurrency(finalPricing.recommendedPrice)}
              </p>
              {pricing.deliveryFee > 0 ? (
                <p style={{ fontSize: "14px" }}>
                  {copy.client.deliveryLabel}:{" "}
                  {formatCurrency(pricing.deliveryFee)}
                </p>
              ) : null}

              {clientMessage ? (
                <p
                  style={{ fontSize: "12px", marginTop: "12px", color: "#555" }}
                >
                  {clientMessage}
                </p>
              ) : null}

              <div
                style={{
                  borderTop: "1px solid #e5e7eb",
                  paddingTop: "10px",
                  marginTop: "14px",
                  fontSize: "10px",
                  color: "#6b7280",
                  lineHeight: 1.35,
                }}
              >
                <p>{copy.client.legalNote1}</p>
                <p style={{ marginTop: "6px" }}>{copy.client.legalNote2}</p>
              </div>
            </div>
          </div>

          {/* MENSAJES PREDEFINIDOS (FREE) */}
          <div className="space-y-2">
            <p className="text-xs font-semibold text-slate-600">
              {copy.client.quickMessages}
            </p>
            <div className="flex flex-wrap gap-2">
              {copy.client.quickMessagePresets.map((msg: string) => (
                <button
                  key={msg}
                  type="button"
                  onClick={() => setClientMessage(msg)}
                  className="rounded-full border border-slate-300 bg-white px-3 py-1 text-xs text-slate-700 hover:bg-slate-100"
                >
                  {msg}
                </button>
              ))}
            </div>
          </div>

          {/* MENSAJE PERSONALIZADO (PRO – BLOQUEADO) */}
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-600">
              {copy.client.customMessageLabel}
            </label>
            <textarea
              value={clientMessage}
              onChange={(e) => setClientMessage(e.target.value)}
              disabled={!isPro}
              rows={3}
              className={`w-full resize-none rounded-xl border p-3 text-sm ${
                isPro
                  ? "border-brand-rose bg-white text-slate-700"
                  : "border-slate-300 bg-slate-100 text-slate-600 cursor-not-allowed"
              }`}
            />
            <p className="mt-1 text-[10px] text-slate-400">
              {isPro
                ? copy.client.customMessageLabel
                : copy.client.clientMessageLocked}
            </p>
          </div>

          {process.env.NODE_ENV === "development" && (
            <button
              type="button"
              onClick={() => setIsPro((prev) => !prev)}
              className="mt-2 text-[10px] underline text-slate-400"
            >
              {copy.client.devTogglePro}
            </button>
          )}

          <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-4 text-xs leading-relaxed text-slate-600">
            <p className="font-semibold text-brand-slate">
              {copy.recipeInfo.title}
            </p>
            <ul className="mt-2 list-disc space-y-1 pl-4">
              {copy.recipeInfo.items.map((item: string) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>

          <ProFeatures />

          {!hasCalculated ? (
            <p className="text-xs text-slate-500">{copy.recipeInfo.cta}</p>
          ) : null}
        </section>
      ) : null}

      {/* BRAND TAB */}
      {activeTab === "brand" ? (
        <section className="mx-auto max-w-md space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow">
            <h3 className="mb-1 text-lg font-bold text-brand-slate">
              {copy.brand.title}
            </h3>
            <p className="mb-4 text-sm text-slate-500">
              {copy.brand.description}
            </p>

            <div className="mb-4">
              <label className="mb-1 block text-sm font-semibold text-slate-600">
                {copy.brand.businessName}
              </label>
              <input
                type="text"
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
                placeholder={copy.brand.businessNamePlaceholder}
                disabled={!isPro}
                className={`w-full rounded-xl border p-3 text-sm ${
                  isPro
                    ? "border-brand-rose bg-white text-slate-700"
                    : "border-slate-300 bg-slate-100 text-slate-600 cursor-not-allowed"
                }`}
              />
              {!isPro && (
                <p className="mt-1 text-[11px] text-slate-400">
                  {copy.brand.proOnlyNote}
                </p>
              )}
            </div>

            <div>
              <label className="mb-1 block text-sm font-semibold text-slate-600">
                {copy.brand.logo}
              </label>

              {businessLogo ? (
                <div className="flex h-32 items-center justify-center rounded-xl border border-slate-200 bg-white">
                  <img
                    src={businessLogo}
                    alt={copy.brand.logo}
                    className="max-h-24 object-contain"
                  />
                </div>
              ) : (
                <div className="flex h-32 items-center justify-center rounded-xl border border-dashed border-slate-300 bg-slate-50 text-sm text-slate-400">
                  {copy.brand.logoEmpty}
                </div>
              )}

              {isPro ? (
                <input
                  type="file"
                  accept="image/*"
                  className="mt-2 block w-full text-xs"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (!file) return;

                    const reader = new FileReader();
                    reader.onload = () => {
                      setBusinessLogo(reader.result as string);
                    };
                    reader.readAsDataURL(file);
                  }}
                />
              ) : (
                <div className="mt-4 rounded-xl bg-slate-900/90 p-3 text-center text-xs font-bold uppercase tracking-wide text-white">
                  {copy.client.proBadge}
                </div>
              )}
            </div>
          </div>
        </section>
      ) : null}
      {/* PRO TAB */}
      {activeTab === "pro" ? (
        <section className="space-y-6">
          {/* PRO intro */}
          <div className="rounded-3xl bg-white p-6 shadow-card ring-1 ring-brand-rose/20">
            <h3 className="text-2xl font-black text-brand-slate">
              ✨ {copy.pro.intro.title}
            </h3>

            <p className="mt-2 text-sm text-slate-600">
              {copy.pro.intro.description}
            </p>

            <ul className="mt-5 space-y-3 text-sm text-slate-700">
              <li>⚡ {copy.pro.intro.features.energy}</li>
              <li>🏠 {copy.pro.intro.features.rent}</li>
              <li>📣 {copy.pro.intro.features.marketing}</li>
              <li>📦 {copy.pro.intro.features.storage}</li>
              <li>☁️ {copy.pro.intro.features.cloud}</li>
            </ul>

            <div className="mt-6 rounded-xl bg-brand-rose/10 p-4 text-sm text-brand-slate">
              <strong>{copy.pro.intro.includesLabel}</strong>{" "}
              {copy.pro.intro.includesText}
            </div>
          </div>

          {/* PRO toggle */}
          <div className="rounded-3xl border border-dashed border-brand-rose/30 bg-brand-rose/5 p-5 text-center space-y-2">
            <p className="text-sm font-semibold text-brand-slate">
              🔒 {copy.pro.toggle.title}
            </p>

            <button
              type="button"
              onClick={() => {
                setIsPro(true);
                alert("🎉 CakePrice Pro unlocked! (Simulated purchase)");
              }}
              className="w-full rounded-xl bg-brand-slate px-4 py-3 text-sm font-bold text-white transition hover:-translate-y-0.5 hover:shadow-lg"
            >
              🔓 Unlock CakePrice Pro
            </button>
            <p className="text-xs text-slate-600">{copy.pro.toggle.note}</p>
          </div>

          {/* ENERGY */}
          {isPro && (
            <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-5 space-y-4">
              <h3 className="text-lg font-semibold">
                🔌 {copy.pro.energy.title}
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="text-sm font-medium">
                    {copy.pro.energy.ovenKwh}
                  </label>
                  <input
                    type="number"
                    value={ovenKwh === 0 ? "" : ovenKwh}
                    onChange={(e) => setOvenKwh(Number(e.target.value) || 0)}
                    className="mt-1 w-full rounded-lg border px-3 py-2"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium">
                    {copy.pro.energy.ovenHours}
                  </label>
                  <input
                    type="number"
                    value={ovenHours === 0 ? "" : ovenHours}
                    onChange={(e) => setOvenHours(Number(e.target.value) || 0)}
                    className="mt-1 w-full rounded-lg border px-3 py-2"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium">
                    {copy.pro.energy.energyRate}
                  </label>
                  <input
                    type="number"
                    value={energyRate === 0 ? "" : energyRate}
                    onChange={(e) => setEnergyRate(Number(e.target.value) || 0)}
                    className="mt-1 w-full rounded-lg border px-3 py-2"
                  />
                </div>
              </div>

              <div className="pt-3 border-t text-sm">
                <strong>{copy.pro.energy.result}:</strong>{" "}
                {formatCurrency(ovenEnergyCost)}
              </div>
            </div>
          )}

          {/* RENT */}
          {isPro && (
            <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-5 space-y-4">
              <h3 className="text-lg font-semibold">
                🏠 {copy.pro.rent.title}
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="text-sm font-medium">
                    {copy.pro.rent.monthlyRent}
                  </label>
                  <input
                    type="number"
                    value={monthlyRent === 0 ? "" : monthlyRent}
                    onChange={(e) =>
                      setMonthlyRent(Number(e.target.value) || 0)
                    }
                    className="mt-1 w-full rounded-lg border px-3 py-2"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium">
                    {copy.pro.rent.workDays}
                  </label>
                  <input
                    type="number"
                    value={workDaysPerMonth === 0 ? "" : workDaysPerMonth}
                    onChange={(e) =>
                      setWorkDaysPerMonth(Number(e.target.value) || 0)
                    }
                    className="mt-1 w-full rounded-lg border px-3 py-2"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium">
                    {copy.pro.rent.daysUsed}
                  </label>
                  <input
                    type="number"
                    value={daysUsedForOrder === 0 ? "" : daysUsedForOrder}
                    onChange={(e) =>
                      setDaysUsedForOrder(Number(e.target.value) || 0)
                    }
                    className="mt-1 w-full rounded-lg border px-3 py-2"
                  />
                </div>
              </div>

              <div className="pt-3 border-t text-sm">
                <strong>{copy.pro.rent.result}:</strong>{" "}
                {formatCurrency(rentCostPerOrder)}
              </div>
            </div>
          )}

          {/* UTILITIES */}
          {isPro && (
            <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-5 space-y-4">
              <h3 className="text-lg font-semibold">
                💧⚡🌐 {copy.pro.utilities.title}
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="text-sm font-medium">
                    {copy.pro.utilities.monthlyUtilities}
                  </label>
                  <input
                    type="number"
                    value={monthlyUtilities === 0 ? "" : monthlyUtilities}
                    onChange={(e) =>
                      setMonthlyUtilities(Number(e.target.value) || 0)
                    }
                    className="mt-1 w-full rounded-lg border px-3 py-2"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium">
                    {copy.pro.utilities.workDays}
                  </label>
                  <input
                    type="number"
                    value={
                      utilityWorkDaysPerMonth === 0
                        ? ""
                        : utilityWorkDaysPerMonth
                    }
                    onChange={(e) =>
                      setUtilityWorkDaysPerMonth(Number(e.target.value) || 0)
                    }
                    className="mt-1 w-full rounded-lg border px-3 py-2"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium">
                    {copy.pro.utilities.daysUsed}
                  </label>
                  <input
                    type="number"
                    value={
                      utilityDaysUsedForOrder === 0
                        ? ""
                        : utilityDaysUsedForOrder
                    }
                    onChange={(e) =>
                      setUtilityDaysUsedForOrder(Number(e.target.value) || 0)
                    }
                    className="mt-1 w-full rounded-lg border px-3 py-2"
                  />
                </div>
              </div>

              <div className="pt-3 border-t text-sm">
                <strong>{copy.pro.utilities.result}:</strong>{" "}
                {formatCurrency(utilitiesCostPerOrder)}
              </div>
            </div>
          )}

          {/* MARKETING */}
          {isPro && (
            <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-5 space-y-4">
              <h3 className="text-lg font-semibold">
                📣 {copy.pro.marketing.title}
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">
                    {copy.pro.marketing.monthlyMarketing}
                  </label>
                  <input
                    type="number"
                    value={monthlyMarketing === 0 ? "" : monthlyMarketing}
                    onChange={(e) =>
                      setMonthlyMarketing(Number(e.target.value) || 0)
                    }
                    className="mt-1 w-full rounded-lg border px-3 py-2"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium">
                    {copy.pro.marketing.ordersPerMonth}
                  </label>
                  <input
                    type="number"
                    value={ordersPerMonth === 0 ? "" : ordersPerMonth}
                    onChange={(e) =>
                      setOrdersPerMonth(Number(e.target.value) || 0)
                    }
                    className="mt-1 w-full rounded-lg border px-3 py-2"
                  />
                </div>
              </div>

              <div className="pt-3 border-t text-sm">
                <strong>{copy.pro.marketing.result}:</strong>{" "}
                {formatCurrency(marketingCostPerOrder)}
              </div>
            </div>
          )}

          {/* INCLUDE PRO COSTS */}
          {isPro && (
            <div className="mt-6 rounded-2xl border border-brand-rose/30 bg-brand-rose/10 p-5">
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={includeProCosts}
                  onChange={(e) => setIncludeProCosts(e.target.checked)}
                  className="mt-1 h-4 w-4 rounded border-slate-300 text-brand-slate focus:ring-brand-rose"
                />
                <div className="text-sm">
                  <p className="font-semibold text-brand-slate">
                    {copy.pro.includeCosts.title}
                  </p>
                  <p className="text-xs text-slate-600">
                    {copy.pro.includeCosts.description}
                  </p>
                </div>
              </label>
            </div>
          )}
        </section>
      ) : null}
    </main>
  );
}
