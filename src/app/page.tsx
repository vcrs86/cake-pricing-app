"use client";

import {
  CalculatorForm,
  type CalculatorFormState,
} from "@/components/CalculatorForm";
import { type RecipeLineInput } from "@/components/RecipeBuilder";
import { ResultCard } from "@/components/ResultCard";
import { QuotePreviewCard } from "@/components/QuotePreviewCard";
import { HelpTab } from "@/components/tabs/HelpTab";
import { ProFeatures } from "@/components/ProFeatures";
import {
  CAKE_SIZES,
  calculatePricing,
  calculateTieredPricing,
  type TieredPricingResult,
} from "@/lib/pricing";
import {
  buildIngredient,
  calculateRecipeCost,
  type Ingredient,
  type RecipeLine,
} from "@/lib/ingredients";
import { useLanguage } from "@/lib/i18n";
import { ProLockedOverlay } from "@/components/ProLockedOverlay";
import { usePro } from "@/lib/pro";
import { BRANDING } from "@/lib/branding";
import { ProStatusBadge } from "@/components/ProStatusBadge";
import { useMemo, useState, useEffect } from "react";
import { CakeLevels } from "@/components/CakeLevels";
import type { CakeLevel } from "@/lib/types/cakeLevel";
import { RecipesTab } from "@/components/tabs/RecipesTab";
import { useRecipes } from "@/lib/hooks/useRecipes";
import { ProBadgeLink } from "@/components/ProBadgeLink";
import { RecipeHelpModal } from "@/components/RecipeHelpModal";
import type { Recipe } from "@/lib/types/Recipe";
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
  const { isPro } = usePro();
  const [isTieredCake, setIsTieredCake] = useState(false);
  const [showRecipeHelp, setShowRecipeHelp] = useState(false);
  const [showRentHelp, setShowRentHelp] = useState(false);
const [showUtilitiesHelp, setShowUtilitiesHelp] = useState(false);
const [showEnergyHelp, setShowEnergyHelp] = useState(false);
const [showMarketingHelp, setShowMarketingHelp] = useState(false);


  const [levels, setLevels] = useState<CakeLevel[]>([
    {
      id: crypto.randomUUID(),
      flavor: "",
      shape: "round",
      size: { type: "diameter", value: undefined },
      servings: undefined,
      complexity: "basic",
    },
  ]);

  const formatCurrency = (value: number) => {
    const safeValue = Number.isFinite(Number(value)) ? Number(value) : 0;

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
    }).format(safeValue);

    return `${currency} ${formatted}`;
  };
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
          cost: 0,
        };
      }

      const qty = Number(line.quantity) || 0;
      const price = Number(
        ingredient.price || (ingredient as any).packageCost || 0,
      );
      const size = Number(
        ingredient.baseQuantity || (ingredient as any).packageSize || 1,
      );
      const total = (qty / size) * price;

      // Devolvemos el objeto EXACTAMENTE como lo pide el error de Vercel
      return {
        lineId: line.id,
        total: total,
        ingredientName: ingredient.name,
        unit: ingredient.unit,
        quantity: qty,
        cost: total, // Vercel pide 'cost', así que le pasamos el mismo total
      };
    });
  }, [ingredientLookup, recipeLines]);

  // --- TOTAL GENERAL ---
  const totalIngredientsCost = useMemo(() => {
    return lineCosts.reduce((acc, curr) => acc + curr.total, 0);
  }, [lineCosts]);

  const [editingQuoteId, setEditingQuoteId] = useState<string | null>(null);
  const [isEditingQuote, setIsEditingQuote] = useState(false);
  const [recipeSearchTerm, setRecipeSearchTerm] = useState("");
  const [clientPhoto, setClientPhoto] = useState<string | null>(null);
  // PRO – Recipes
  const [recipeName, setRecipeName] = useState("");
  const {
    recipes: savedRecipes,
    upsertRecipe,
    removeRecipe,
  } = useRecipes(isPro);
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
  // LOAD SAVED QUOTES (PRO)
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

  const [activeTab, setActiveTab] = useState<
  "calculator" | "recipes" | "client" | "pro" | "help"
>("calculator");


  const [businessName, setBusinessName] = useState("");
  const [businessLogo, setBusinessLogo] = useState<string | null>(null);
  const [selectedFileName, setSelectedFileName] = useState<string | null>(null);

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
   CALC OVEN ENERGY COST
========================= */
  const ovenEnergyCost = useMemo(() => {
    return ovenKwh * ovenHours * energyRate;
  }, [ovenKwh, ovenHours, energyRate]);
  /* =========================
   CALC RENT COST
========================= */
  const rentCostPerOrder = useMemo(() => {
    if (workDaysPerMonth <= 0) return 0;
    const dailyRent = monthlyRent / workDaysPerMonth;
    return dailyRent * daysUsedForOrder;
  }, [monthlyRent, workDaysPerMonth, daysUsedForOrder]);
  /* =========================
   CALC UTILITIES COST
========================= */
  const utilitiesCostPerOrder = useMemo(() => {
    if (utilityWorkDaysPerMonth <= 0) return 0;
    const dailyUtilities = monthlyUtilities / utilityWorkDaysPerMonth;
    return dailyUtilities * utilityDaysUsedForOrder;
  }, [monthlyUtilities, utilityWorkDaysPerMonth, utilityDaysUsedForOrder]);
  /* =========================
   CALC MARKETING COST
========================= */
  const marketingCostPerOrder = useMemo(() => {
    if (ordersPerMonth <= 0) return 0;
    return monthlyMarketing / ordersPerMonth;
  }, [monthlyMarketing, ordersPerMonth]);
  /* =========================
   TOTAL PRO OPERATIONAL COST
========================= */
  const totalProOperationalCost = useMemo(() => {
    return (
      ovenEnergyCost +
      rentCostPerOrder +
      utilitiesCostPerOrder +
      marketingCostPerOrder
    );
  }, [
    ovenEnergyCost,
    rentCostPerOrder,
    utilitiesCostPerOrder,
    marketingCostPerOrder,
  ]);

  // PRO – Logo upload
  const handleUploadLogo = (file: File) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const result = reader.result;
      if (typeof result === "string") {
        setBusinessLogo(result);
      }
    };
    reader.readAsDataURL(file);
  };
  const recipeLineNumbers: RecipeLine[] = useMemo(
    () =>
      recipeLines.map((line) => ({
        ...line,
        ingredientId: line.ingredientId,
        quantity: Number(line.quantity) || 0,
      })),
    [recipeLines],
  );

  const recipeCostBreakdown = useMemo(
    () => calculateRecipeCost(ingredients, recipeLineNumbers),
    [ingredients, recipeLineNumbers],
  );
  // DATA CALCULATIONS
  const selectedSize =
    CAKE_SIZES.find((size) => size.id === values.cakeSize) ?? CAKE_SIZES[0];
  // ✅ REAL INGREDIENT COST (manual OR recipe)
  const manualIngredientCost = Number(values.basicIngredientsCost) || 0;

  const ingredientCost = useMemo(() => {
    const recipeTotal = recipeCostBreakdown?.total ?? 0;

    return recipeTotal > 0 ? recipeTotal : manualIngredientCost;
  }, [recipeCostBreakdown, manualIngredientCost]);

  const decorationCostValue = Number(values.decorationCost) || 0;
  const setupHoursValue = Number(values.setupHours) || 0;
  const setupRateValue = Number(values.setupRate) || 0;
  const deliveryFeeValue = Number(values.deliveryFee) || 0;
  const decorationExtrasTotal =
    (Number(values.cakeTopper) || 0) +
    (Number(values.sugarFlowers) || 0) +
    (Number(values.freshFlowers) || 0) +
    (Number(values.figures3d) || 0);

  const cakeLevelsCopy = copy.cakeLevels;

  const formatTierSize = (level: CakeLevel) => {
  const size = level.size;

  if (!size) return "";

  if (size.type === "diameter" || size.type === "side") {
    return size.value ? `${size.value}"` : "";
  }

  if (size.type === "dimensions") {
    if (!size.width || !size.height) return "";
    return `${size.width}" x ${size.height}"`;
  }

  return "";
};


  const totalBaseServings = useMemo(() => {
    if (!isTieredCake) return selectedSize.servings;
    return levels.reduce(
      (sum, level) => sum + (Number(level.servings) || 0),
      0,
    );
  }, [isTieredCake, levels, selectedSize.servings]);

  const basePricingInputs = useMemo(
    () => ({
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
      servings: totalBaseServings,
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
      totalBaseServings,
    ],
  );

  const pricing = useMemo(
    () => calculatePricing(basePricingInputs),
    [basePricingInputs],
  );

  const tieredPricing = useMemo<TieredPricingResult | null>(() => {
    if (!isTieredCake) return null;
    const tiers = levels.map((level) => ({
      size: formatTierSize(level),
      servings: Number(level.servings) || 0,
    }));

    return calculateTieredPricing({
      baseInputs: basePricingInputs,
      tiers,
      baseServings: selectedSize.servings,
      deliveryFee: deliveryFeeValue,
    });
  }, [
    isTieredCake,
    levels,
    basePricingInputs,
    selectedSize.servings,
    deliveryFeeValue,
    cakeLevelsCopy,
  ]);

  const totalTierServings = useMemo(
    () => levels.reduce((sum, level) => sum + (Number(level.servings) || 0), 0),
    [levels],
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

  const handleUseRecipe = (recipe: Recipe) => {
    setIngredients(recipe.ingredients);
    setRecipeLines(recipe.recipeLines);
    setValues((prev) => ({
      ...prev,
      cakeSize: recipe.cakeSize ?? prev.cakeSize,
    }));
  };

  const handleDeleteRecipe = (id: string) => {
    if (!confirm(copy.recipes.confirmDelete)) return;
    removeRecipe(id);
  };
  const handlePrintQuote = () => {
  const quote = document.querySelector(".quote-print") as HTMLElement | null;

  if (!quote) {
    alert("No hay cotización para imprimir todavía.");
    return;
  }

  const printWindow = window.open("", "_blank");
  if (!printWindow) return;

  // Tomar todos los estilos cargados en la app
  const styles = Array.from(document.styleSheets)
    .map((sheet) => {
      try {
        return Array.from(sheet.cssRules || [])
          .map((rule) => rule.cssText)
          .join("");
      } catch {
        return "";
      }
    })
    .join("");

  printWindow.document.write(`
    <html>
      <head>
        <title>Quote</title>

        <style>
          ${styles}

          /* Refuerzo para impresión */
          body {
            background: white !important;
            margin: 0;
            padding: 30px;
          }

          .quote-print {
            margin: 0 auto;
            max-width: 420px;
          }
        </style>
      </head>

      <body>
        ${quote.outerHTML}
      </body>
    </html>
  `);

  printWindow.document.close();
  printWindow.focus();

  setTimeout(() => {
    printWindow.print();
    printWindow.close();
  }, 600);
};

const handleOpenPdfQuote = () => {
  const quote = document.querySelector(".quote-print") as HTMLElement | null;

  if (!quote) {
    alert("No hay cotización para generar el PDF todavía.");
    return;
  }

  const pdfWindow = window.open("", "_blank");
  if (!pdfWindow) return;

  // Copiar todos los estilos activos (Tailwind + custom)
  const styles = Array.from(document.styleSheets)
    .map((sheet) => {
      try {
        return Array.from(sheet.cssRules || [])
          .map((rule) => rule.cssText)
          .join("");
      } catch {
        return "";
      }
    })
    .join("");

  pdfWindow.document.write(`
    <html>
      <head>
        <title>Quote PDF</title>

        <style>
          ${styles}

          body {
            background: white !important;
            margin: 0;
            padding: 30px;
          }

          .quote-print {
            margin: 0 auto;
            max-width: 420px;
          }
        </style>
      </head>

      <body>
        ${quote.outerHTML}
      </body>
    </html>
  `);

  pdfWindow.document.close();
  pdfWindow.focus();
};



  const handleSaveRecipe = () => {
    const newRecipe: Recipe = {
      id: crypto.randomUUID(),
      name: recipeName || copy.recipes.unnamed,
      cakeSize: values.cakeSize,
      ingredients,
      recipeLines,
      createdAt: new Date().toISOString(),
    };

    upsertRecipe(newRecipe);
    setRecipeName("");
  };

  const handleModeChange = (nextMode: "basic" | "advanced") => {
    setMode(nextMode);
    if (nextMode === "basic") {
      setIsTieredCake(false);
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
    const safe = (n: any) => {
      const num = Number(n);
      return Number.isFinite(num) ? num : 0;
    };

    const basePricing =
      isTieredCake && tieredPricing ? tieredPricing.combinedPricing : pricing;

    const baseRecommended = safe(basePricing?.recommendedPrice);
    const proOps = safe(totalProOperationalCost);

    const finalRecommended =
      isPro && includeProCosts ? baseRecommended + proOps : baseRecommended;

    const servingsSafe = safe(
      isTieredCake ? totalTierServings : selectedSize?.servings,
    );

    return {
      ...basePricing,

      recommendedPrice: safe(finalRecommended),

      perServing: servingsSafe > 0 ? safe(finalRecommended) / servingsSafe : 0,

      additionalCost: isPro && includeProCosts ? proOps : 0,

      additionalCosts: isPro && includeProCosts ? proOps : 0,
    };
  }, [
    pricing,
    tieredPricing,
    isTieredCake,
    isPro,
    includeProCosts,
    totalProOperationalCost,
    selectedSize?.servings,
    totalTierServings,
  ]);

  const displayServings = isTieredCake
    ? totalTierServings
    : selectedSize.servings;

  return (
    <main className="no-print mx-auto flex min-h-[100svh] sm:min-h-screen max-w-6xl flex-col gap-8 px-4 pb-12 pt-10 sm:px-6 lg:px-10">
      {/* LOGO ANCLA */}
      <div className="flex justify-center mb-2 sm:mb-1">
        <img
          src="/brand/logo-primary.png"
          alt="CakePRICE"
          className="h-48 sm:h-40 w-auto"
        />
      </div>
      <div className="mb-4 flex justify-end sm:mb-1">
        <ProStatusBadge />
      </div>

      <section className="relative overflow-hidden rounded-3xl bg-white/60 backdrop-blur-xl shadow-xl ring-1 ring-white/40 p-5 sm:p-10">
        {/* Decorative blobs */}
        <div className="pointer-events-none absolute -top-24 -right-24 h-72 w-72 rounded-full bg-brand-rose/20 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-brand-peach/30 blur-3xl" />

        <div className="relative z-10">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
            {/* LEFT */}
            <div className="space-y-3 sm:space-y-4">
              {/* BADGE */}
              <span className="inline-flex items-center rounded-full bg-brand-rose/20 px-3 py-1 text-[11px] font-semibold text-brand-slate">
                🎂 {copy.general.badge}
              </span>

              {/* TITLE */}
              <h1 className="text-3xl font-black text-brand-slate sm:text-4xl">
                {copy.general.appTitle}
              </h1>

              {/* TAGLINE */}
              <p className="max-w-2xl text-sm leading-relaxed text-slate-600 sm:text-sm text-[13px]">
                {copy.general.tagline}
              </p>

              {/* TRUST NOTE */}
              <p className="text-[11px] sm:text-xs text-slate-500 italic">
                {copy.general.trustNote}
              </p>
            </div>

            {/* RIGHT */}
            <div className="flex flex-col items-end gap-3 self-start">
              <div className="inline-flex items-center gap-2 rounded-full bg-white/70 px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-slate-600 ring-1 ring-brand-peach/60">
                <span>{copy.languageToggle.label}</span>

                <button
                  type="button"
                  onClick={() => setLanguage("es")}
                  className={`flex items-center gap-1 rounded-full px-2 py-1 text-xs font-bold ${
                    language === "es"
                      ? "bg-brand-rose text-brand-slate shadow"
                      : "hover:bg-slate-100"
                  }`}
                >
                  🇪🇸 <span>ES</span>
                </button>

                <button
                  type="button"
                  onClick={() => setLanguage("en")}
                  className={`flex items-center gap-1 rounded-full px-2 py-1 text-xs font-bold ${
                    language === "en"
                      ? "bg-brand-rose text-brand-slate shadow"
                      : "hover:bg-slate-100"
                  }`}
                >
                  🇺🇸 <span>EN</span>
                </button>
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
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs"
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

      {/* TABS */}
<div className="flex w-full gap-2 overflow-hidden rounded-2xl bg-slate-100 p-2">

  <button
    onClick={() => setActiveTab("calculator")}
    className={`flex-1 min-w-0 rounded-xl px-2 sm:px-4 py-2 text-xs sm:text-sm font-semibold text-center truncate transition ${
      activeTab === "calculator"
        ? "bg-white shadow text-brand-slate"
        : "text-slate-500 hover:bg-white/60"
    }`}
  >
    🧮 {copy.tabs.calculator}
  </button>

  <button
    onClick={() => setActiveTab("recipes")}
    className={`flex-1 min-w-0 rounded-xl px-2 sm:px-4 py-2 text-xs sm:text-sm font-semibold text-center truncate transition ${
      activeTab === "recipes"
        ? "bg-white shadow text-brand-slate"
        : "text-slate-500 hover:bg-white/60"
    }`}
  >
    📚 {copy.tabs.recipes}
  </button>

  <button
    onClick={() => setActiveTab("client")}
    className={`flex-1 min-w-0 rounded-xl px-2 sm:px-4 py-2 text-xs sm:text-sm font-semibold text-center truncate transition ${
      activeTab === "client"
        ? "bg-white shadow text-brand-slate"
        : "text-slate-500 hover:bg-white/60"
    }`}
  >
    🎨 {copy.tabs.client}
  </button>

  <button
    onClick={() => setActiveTab("pro")}
    className={`flex-1 min-w-0 rounded-xl px-2 sm:px-4 py-2 text-xs sm:text-sm font-semibold text-center truncate transition ${
      activeTab === "pro"
        ? "bg-white shadow text-brand-slate"
        : "text-slate-500 hover:bg-white/60"
    }`}
  >
    ✨ {copy.tabs.pro}
  </button>

  <button
    onClick={() => setActiveTab("help")}
    className={`flex-1 min-w-0 rounded-xl px-2 sm:px-4 py-2 text-xs sm:text-sm font-semibold text-center truncate transition ${
      activeTab === "help"
        ? "bg-white shadow text-brand-slate"
        : "text-slate-500 hover:bg-white/60"
    }`}
  >
    ❓ {copy.tabs.help}
  </button>

</div>

      {activeTab === "recipes" && (
  <>
    {/* Help Button - SOLO PRO + TIER */}
    {isPro && isTieredCake && (
      <div className="flex justify-end mb-2">
        <button
          type="button"
          onClick={() => setShowRecipeHelp(true)}
          className="flex items-center gap-2 rounded-full border border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-100"
        >
          ❓ {copy.recipes.helpLabel}
        </button>
      </div>
    )}

    {/* RecipesTab SIEMPRE visible */}
    <RecipesTab
      ingredients={ingredients}
      recipeLines={recipeLines}
      onAddIngredient={(newIng) =>
        setIngredients((prev) => [...prev, newIng])
      }
      onUpdateIngredient={(id, patch) =>
        setIngredients((prev) =>
          prev.map((ing) =>
            ing.id === id ? { ...ing, ...patch } : ing,
          ),
        )
      }
      onDeleteIngredient={handleDeleteIngredient}
      onAddLine={handleAddLine}
      onChangeLine={handleChangeLine}
      onRemoveLine={handleRemoveLine}
      lineCosts={lineCosts}
      totalIngredientsCost={totalIngredientsCost}
      recipeName={recipeName}
      setRecipeName={setRecipeName}
      onSaveRecipe={handleSaveRecipe}
      savedRecipes={savedRecipes}
      isPro={isPro}
      formatCurrency={formatCurrency}
      currency={currency}
      onUseRecipe={handleUseRecipe}
      onDeleteRecipe={handleDeleteRecipe}
      recipeSearchTerm={recipeSearchTerm}
      setRecipeSearchTerm={setRecipeSearchTerm}
      onUpgrade={() => setActiveTab("pro")}
    />
  </>
)}
      {/* CALCULATOR TAB */}
      {activeTab === "calculator" ? (
        <section className="grid grid-cols-1 gap-6 lg:grid-cols-3 animate-in fade-in slide-in-from-bottom-2 duration-300">
          <div className="lg:col-span-2">
            <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm mb-6">
              <div className="space-y-4">
                {/* TIERED CAKE — PRO ONLY */}
{!isPro ? (
  /* CASO 1: NO ES PRO */
  <ProLockedOverlay
    title={copy.pro.features.tieredCake.title}
    description={copy.pro.features.tieredCake.description}
    onUpgrade={() => setActiveTab("pro")}
  />

) : mode !== "advanced" ? (

  /* CASO 2: ES PRO PERO ESTÁ EN BASIC */
  <div className="rounded-xl border border-dashed border-amber-300 bg-amber-50 p-4">
    <p className="text-sm font-semibold text-amber-700">
      ⚠️ {copy.pro.tieredAdvancedOnly.title}
    </p>

    <p className="mt-1 text-xs text-amber-600">
      {copy.pro.tieredAdvancedOnly.description}
    </p>
  </div>

) : (

  /* CASO 3: PRO + ADVANCED */
  <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-4">
    <label className="flex items-start gap-3 cursor-pointer">
      <input
        type="checkbox"
        checked={isTieredCake}
        onChange={(e) => setIsTieredCake(e.target.checked)}
        className="mt-1 h-4 w-4 rounded border-slate-300 text-brand-slate"
      />

      <div className="text-sm">
        <p className="font-semibold text-brand-slate">
          🎂 {copy.cakeLevels?.title ?? "Tiered cake"}
        </p>

        <p className="text-xs text-slate-600">
          {copy.cakeLevels?.helper ??
            "Use this option if your cake has multiple tiers."}
        </p>
      </div>
    </label>
  </div>
)}


                {isTieredCake && (
                  <div className="space-y-4">
                    <CakeLevels levels={levels} setLevels={setLevels} />

                    {tieredPricing && (
                      <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                        <div className="mb-3 flex items-center justify-between">
                          <h3 className="text-sm font-semibold text-brand-slate">
                            {cakeLevelsCopy?.tieredSummary ??
                              "Tiered cake summary"}
                          </h3>
                          <span className="text-xs text-slate-500">
                            {cakeLevelsCopy?.totalPrice ?? "Total price"}:{" "}
                            <span className="font-semibold text-brand-slate">
                              {formatCurrency(tieredPricing.totalPrice)}
                            </span>
                          </span>
                        </div>

                        <div className="space-y-2 text-xs text-slate-600">
                          {tieredPricing.tiers.map((tier, index) => (
                            <div
                              key={`${tier.size}-${index}`}
                              className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2"
                            >
                              <span className="font-semibold text-slate-700">
                                {cakeLevelsCopy?.tier ?? "Tier"} {index + 1}
                              </span>
                              <span className="text-slate-500">
                                {tier.size || (cakeLevelsCopy?.size ?? "Size")}
                              </span>
                              <span>
                                {cakeLevelsCopy?.servingsLabel ?? "Servings"}:{" "}
                                <span className="font-semibold text-slate-700">
                                  {tier.servings || 0}
                                </span>
                              </span>
                              <span>
                                {cakeLevelsCopy?.factorLabel ?? "Factor"}:{" "}
                                <span className="font-semibold text-slate-700">
                                  {tier.factor.toFixed(2)}
                                </span>
                              </span>
                              <span>
                                {cakeLevelsCopy?.tierCostLabel ?? "Tier cost"}:{" "}
                                <span className="font-semibold text-brand-slate">
                                  {formatCurrency(tier.cost)}
                                </span>
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </section>

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
              servings={displayServings}
              formatCurrency={formatCurrency}
            />

            {/* SAVE QUOTE + LIST (solo Advanced) */}
            {mode === "advanced" && (
              <div className="space-y-3">
                {/* Guardar presupuesto (PRO) o Lock (FREE) */}
                {!isPro ? (
                  <ProLockedOverlay
                    title={copy.pro.features.saveQuotes.title}
                    description={copy.pro.features.saveQuotes.description}
                    onUpgrade={() => setActiveTab("pro")}
                  />
                ) : (
                  <div className="mx-auto w-full max-w-sm rounded-xl border border-dashed border-brand-rose/30 bg-brand-rose/5 p-3 space-y-2">
                    <h3 className="text-xs font-semibold text-brand-slate uppercase tracking-wide">
                      💾 {copy.quotes.saveTitle}
                    </h3>

                    <input
                      type="text"
                      value={quoteName}
                      onChange={(e) => setQuoteName(e.target.value)}
                      placeholder={copy.quotes.savePlaceholder}
                      className="w-full rounded-lg border border-brand-rose bg-white px-3 py-2 text-sm"
                    />

                    <button
                      type="button"
                      disabled={finalPricing.recommendedPrice <= 0}
                      onClick={() => {
                        const newQuote: SavedQuote = {
                          id:
                            isEditingQuote && editingQuoteId
                              ? editingQuoteId
                              : crypto.randomUUID(),
                          name: quoteName || copy.quotes.unnamed,
                          createdAt: new Date().toISOString(),
                          currency,
                          servings: displayServings,
                          recipeName: recipeName || undefined,
                          ingredients,
                          recipeLines,
                          values,
                          pricing: {
                            recommended: finalPricing.recommendedPrice,
                            delivery: pricing.deliveryFee,
                            perServing:
                              displayServings > 0
                                ? finalPricing.recommendedPrice /
                                  displayServings
                                : 0,
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

                        setIsEditingQuote(false);
                        setEditingQuoteId(null);
                        setQuoteName("");
                      }}
                      className="w-full rounded-xl bg-brand-slate px-4 py-2 text-sm font-semibold text-white"
                    >
                      {copy.quotes.saveButton}
                    </button>
                  </div>
                )}
                {/* Lista de presupuestos (PRO) */}
                {isPro && savedQuotes.length > 0 && (
                  <div className="mx-auto w-full max-w-sm rounded-xl border border-slate-200 bg-white p-3 space-y-2">
                    <h3 className="text-xs font-semibold text-brand-slate uppercase tracking-wide">
                      📋 {copy.quotes.listTitle}
                    </h3>

                    <div className="space-y-2">
                      {savedQuotes.map((quote) => (
                        <div
                          key={quote.id}
                          className="flex items-center justify-between rounded-lg border border-slate-200 bg-slate-50 p-2"
                        >
                          <div className="min-w-0">
                            <p className="truncate text-sm font-semibold text-slate-700">
                              {quote.name}
                            </p>
                            <p className="text-xs text-slate-500">
                              {new Date(quote.createdAt).toLocaleDateString()}
                            </p>
                          </div>

                          <div className="flex gap-2">
                            <button
                              type="button"
                              onClick={() => handleUseQuote(quote)}
                              className="rounded-lg bg-brand-slate px-2 py-1 text-[10px] font-semibold text-white hover:shadow"
                            >
                              {copy.quotes.use}
                            </button>
                            <button
                              type="button"
                              onClick={() => handleEditQuote(quote)}
                              className="rounded-lg border border-brand-slate px-2 py-1 text-[10px] font-semibold text-brand-slate hover:bg-brand-slate/10"
                            >
                              {copy.quotes.edit}
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                if (!confirm(copy.quotes.confirmDelete)) return;
                                setSavedQuotes((prev) =>
                                  prev.filter((q) => q.id !== quote.id),
                                );
                                if (editingQuoteId === quote.id) {
                                  setEditingQuoteId(null);
                                  setIsEditingQuote(false);
                                }
                              }}
                              className="rounded-lg border border-red-300 px-2 py-1 text-[10px] font-semibold text-red-600 hover:bg-red-50"
                            >
                              {copy.quotes.delete}
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </section>
      ) : null}

      {/* CLIENT TAB */}
{activeTab === "client" && (
  <>
  {/* CLIENT PHOTO UPLOAD */}
<div className="no-print mx-auto max-w-md space-y-3 mb-6">
  <label className="block text-sm font-semibold text-slate-700">
    📷 {copy.client.cakePhotoLabel}
  </label>

  <label
    htmlFor="client-photo-upload"
    className={`flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed p-6 text-center transition
      ${
        clientPhoto
          ? "border-brand-rose bg-white"
          : "border-slate-300 bg-slate-50 hover:border-brand-rose hover:bg-brand-rose/5"
      }
    `}
  >
    {clientPhoto ? (
      <>
        <img
          src={clientPhoto}
          alt={copy.client.cakePhotoAlt}
          className="mb-3 max-h-48 w-full rounded-xl object-cover"
        />
        <p className="text-xs font-semibold text-slate-600">
          ✔ {copy.client.fileSelected}
        </p>
        <p className="mt-1 text-xs text-slate-400">
          {copy.client.uploadButton}
        </p>
      </>
    ) : (
      <>
        <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-slate-200 text-xl">
          📷
        </div>
        <p className="text-sm font-semibold text-slate-600">
          {copy.client.uploadButton}
        </p>
        <p className="mt-1 text-xs text-slate-400">
          {copy.client.noFileSelected}
        </p>
      </>
    )}

    <input
      id="client-photo-upload"
      type="file"
      accept="image/*"
      className="hidden"
      onChange={(e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = () => {
          if (typeof reader.result === "string") {
            setClientPhoto(reader.result);
          }
        };
        reader.readAsDataURL(file);
      }}
    />
  </label>
</div>

    <QuotePreviewCard
  finalPrice={finalPricing.recommendedPrice}
  servings={displayServings}
  deliveryFee={pricing.deliveryFee}
  imageUrl={clientPhoto || undefined}
  message={clientMessage}
  businessName={isPro ? businessName : ""}
  businessLogo={isPro ? businessLogo : null}
/>
{/* CLIENT MESSAGES */}
<div className="no-print mx-auto max-w-md space-y-3 mt-6">

  <p className="text-sm font-semibold text-slate-700">
    💬 {copy.client.quickMessages}
  </p>

  {/* PRESET BUTTONS */}
  <div className="flex flex-wrap gap-2">
    {(copy.client.quickMessagePresets || []).map((msg: string, i: number) => (
      <button
        key={i}
        type="button"
        onClick={() => setClientMessage(msg)}
        className="rounded-full border border-slate-300 bg-white px-3 py-1 text-xs font-medium text-slate-600 hover:bg-slate-100"
      >
        {msg}
      </button>
    ))}
  </div>

  {/* CUSTOM MESSAGE */}
  <div className="space-y-1">

    <label className="block text-xs font-semibold text-slate-600">
      {copy.client.clientMessageLabel}
    </label>

    <textarea
      rows={3}
      value={clientMessage}
      onChange={(e) => setClientMessage(e.target.value)}
      disabled={!isPro}
      placeholder={
        isPro
          ? copy.client.customMessageLabel
          : copy.client.clientMessageLocked
      }
      className={`w-full rounded-xl border p-3 text-sm resize-none ${
        isPro
          ? "border-brand-rose bg-white text-slate-700"
          : "border-slate-300 bg-slate-100 text-slate-500 cursor-not-allowed"
      }`}
    />

    {!isPro && (
      <p className="text-[11px] text-slate-400">
        🔒 {copy.client.clientMessageLocked}
      </p>
    )}

    {isPro && (
      <p className="text-[11px] text-brand-slate">
        ✅ {copy.client.proEditActive}
      </p>
    )}

  </div>

</div>

    {/* BOTONES SOLO EN CLIENT */}
    <div className="no-print mx-auto mt-4 max-w-md space-y-2">
  <button
    type="button"
    onClick={handlePrintQuote}
    className="w-full rounded-xl bg-brand-slate px-4 py-3 text-sm font-semibold text-white hover:shadow-lg"
  >
    📄 {copy.client.printButton}
  </button>

  <button
    type="button"
    onClick={handleOpenPdfQuote}
    className="w-full rounded-xl border border-brand-slate px-4 py-3 text-sm font-semibold text-brand-slate"
  >
    💾 {copy.client.openPdfButton}
  </button>
</div>
  </>
)}

      {activeTab === "pro" && (
        <div className="mx-auto max-w-md space-y-6">
          {/* ===================== PRO INTRO + TOGGLE (ARRIBA) ===================== */}

          <div className="space-y-4">
            {/* PRO TOGGLE */}
            {!isPro && (
              <div className="rounded-3xl border border-dashed border-brand-rose/30 bg-brand-rose/5 p-5 text-center space-y-2">
                <p className="text-sm font-semibold text-brand-slate">
                  🔒 {copy.pro.toggle.title}
                </p>

                <button
  type="button"
  onClick={async () => {
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
      });

      const data = await res.json();

      if (data.url) {
        window.location.href = data.url;
      } else {
        alert("Error creating checkout session");
      }
    } catch (err) {
      console.error(err);
      alert("Checkout failed");
    }
  }}
  className="w-full rounded-xl bg-brand-slate px-4 py-3 text-sm font-bold text-white transition hover:-translate-y-0.5 hover:shadow-lg"
>
  🔓 Unlock CakePrice Pro
</button>


                <p className="text-xs text-slate-600">{copy.pro.toggle.note}</p>
              </div>
            )}

            {/* PRO INTRO */}
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
                <li>☁️ {copy.pro.intro.features.cloud}</li>
                <li>🎂 {copy.pro.intro.features.tiered}</li>


                <li className="pt-2 border-t text-slate-600">
                  📋 {copy.pro.intro.extras.saveRecipes}
                </li>
                <li className="text-slate-600">
                  💾 {copy.pro.intro.extras.accessQuotes}
                </li>
                <li className="text-slate-600">
                  🎨 {copy.pro.intro.extras.brandCustomization}
                </li>
              </ul>
            </div>
          </div>
          {/* ===================== CARD 1 — MI MARCA ===================== */}
          {!isPro ? (
            <ProLockedOverlay
              title={copy.pro.features.brandCustomization.title}
              description={copy.pro.features.brandCustomization.description}
              onUpgrade={() => setActiveTab("pro")}
            />
          ) : (
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow space-y-4">
              <h3 className="text-lg font-bold text-brand-slate">
                📦 {copy.brand.title}
              </h3>

              <p className="text-sm text-slate-500">{copy.brand.description}</p>

              {/* NOMBRE DE MARCA */}
              <div>
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

              {/* LOGO */}
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
          )}
          {/* ===================== CARD 2 — COSTOS OPERATIVOS ===================== */}
          {!isPro ? (
            <ProLockedOverlay
              title={copy.pro.features.operationalCosts.title}
              description={copy.pro.features.operationalCosts.description}
              onUpgrade={() => setActiveTab("pro")}
            />
          ) : (
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow space-y-6">
              <h3 className="text-lg font-bold text-brand-slate">
                ⚙️ {copy.pro.operationalCosts.title}
              </h3>
              {/* ===================== ENERGY ===================== */}
              <div className="rounded-xl border bg-slate-50 p-4 space-y-4">
                <div className="flex items-center gap-2">
  <h4 className="font-semibold">
    ⚡ {copy.pro.energy.title}
  </h4>

  <button
    type="button"
    onClick={() => setShowEnergyHelp(true)}
    className="text-xs text-slate-400 hover:text-slate-600"
  >
    ❓
  </button>
</div>

                <p className="text-xs text-slate-500 leading-relaxed">
                  {copy.pro.energy.energyHelp}
                </p>
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
                      onChange={(e) =>
                        setOvenHours(Number(e.target.value) || 0)
                      }
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
                      onChange={(e) =>
                        setEnergyRate(Number(e.target.value) || 0)
                      }
                      className="mt-1 w-full rounded-lg border px-3 py-2"
                    />
                  </div>
                </div>

                <div className="pt-3 border-t text-sm">
                  <strong>{copy.pro.energy.result}:</strong>{" "}
                  {formatCurrency(ovenEnergyCost)}
                </div>
              </div>

              {/* ===================== RENT ===================== */}
              <div className="rounded-xl border bg-slate-50 p-4 space-y-4">
                <div className="flex items-center gap-2">
  <h4 className="font-semibold">
    🏠 {copy.pro.rent.title}
  </h4>

  <button
    type="button"
    onClick={() => setShowRentHelp(true)}
    className="text-xs text-slate-400 hover:text-slate-600"
  >
    ❓
  </button>
</div>


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

              {/* ===================== UTILITIES ===================== */}
              <div className="rounded-xl border bg-slate-50 p-4 space-y-4">
                <div className="flex items-center gap-2">
  <h4 className="font-semibold">
    💧⚡🌐 {copy.pro.utilities.title}
  </h4>

  <button
    type="button"
    onClick={() => setShowUtilitiesHelp(true)}
    className="text-xs text-slate-400 hover:text-slate-600"
  >
    ❓
  </button>
</div>


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

              {/* ===================== MARKETING ===================== */}
              <div className="rounded-xl border bg-slate-50 p-4 space-y-4">
                <div className="flex items-center gap-2">
  <h4 className="font-semibold">
    📣 {copy.pro.marketing.title}
  </h4>

  <button
    type="button"
    onClick={() => setShowMarketingHelp(true)}
    className="text-xs text-slate-400 hover:text-slate-600"
  >
    ❓
  </button>
</div>


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

              {/* INCLUDE PRO COSTS — PROTEGIDO */}
              <div className="rounded-xl border border-brand-rose/30 bg-brand-rose/10 p-4">
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
            </div>
          )}
          {isPro && (
            <div className="pt-4 border-t text-center text-xs text-slate-500">
              {copy.pro.support.text} {copy.pro.support.emailLabel}{" "}
              <a
                href="mailto:cakepriceapp@gmail.com"
                className="font-semibold text-brand-slate underline hover:text-brand-rose"
              >
                cakepriceapp@gmail.com
              </a>
            </div>
          )}
        </div>
      )}
      {/* ===================== HELP TAB ===================== */}
{activeTab === "help" && (
  <HelpTab isPro={isPro} />
)}

      {showRecipeHelp && (
        <RecipeHelpModal onClose={() => setShowRecipeHelp(false)} />
      )}
      {/* ===================== HELP MODALS ===================== */}

{showRentHelp && (
  <RecipeHelpModal
    title={copy.pro.operationalHelp.rent.title}
    description={copy.pro.operationalHelp.rent.description}
    bullets={copy.pro.operationalHelp.rent.bullets}
    onClose={() => setShowRentHelp(false)}
  />
)}

{showUtilitiesHelp && (
  <RecipeHelpModal
    title={copy.pro.operationalHelp.utilities.title}
    description={copy.pro.operationalHelp.utilities.description}
    bullets={copy.pro.operationalHelp.utilities.bullets}
    onClose={() => setShowUtilitiesHelp(false)}
  />
)}
  {/* HELP — ENERGY */}
{showEnergyHelp && (
  <RecipeHelpModal
    title={copy.pro.operationalHelp.energy.title}
    description={copy.pro.operationalHelp.energy.description}
    bullets={copy.pro.operationalHelp.energy.bullets}
    onClose={() => setShowEnergyHelp(false)}
  />

)}
{/* HELP — MARKETING */}
{showMarketingHelp && (
  <RecipeHelpModal
    title={copy.pro.operationalHelp.marketing.title}
    description={copy.pro.operationalHelp.marketing.description}
    bullets={copy.pro.operationalHelp.marketing.bullets}
    onClose={() => setShowMarketingHelp(false)}
  />
)}

    </main>
  );
}
