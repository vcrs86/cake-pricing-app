"use client";

import { CalculatorForm, type CalculatorFormState } from "@/components/CalculatorForm";
import { IngredientManager } from "@/components/IngredientManager";
import { RecipeBuilder, type RecipeLineInput } from "@/components/RecipeBuilder";
import { ResultCard } from "@/components/ResultCard";
import { ProFeatures } from "@/components/ProFeatures";
import { CAKE_SIZES, calculatePricing } from "@/lib/pricing";
import { buildIngredient, calculateRecipeCost, type Ingredient, type RecipeLine } from "@/lib/ingredients";
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


export default function HomePage() {
  const { copy, language, setLanguage } = useLanguage();
  const [mode, setMode] = useState<"basic" | "advanced">("basic");
  const [values, setValues] = useState<CalculatorFormState>(DEFAULT_STATE);
  const [hasCalculated, setHasCalculated] = useState<boolean>(false);
  const [ingredients, setIngredients] = useState<Ingredient[]>(DEFAULT_INGREDIENTS);
  const [recipeLines, setRecipeLines] = useState<RecipeLineInput[]>([]);
  const [clientPhoto, setClientPhoto] = useState<string | null>(null);
  const [clientMessage, setClientMessage] = useState(
  copy.client.quickMessagePresets[0]
);
  useEffect(() => {
  setClientMessage(copy.client.quickMessagePresets[0]);
}, [language]);
  const [activeTab, setActiveTab] = useState<"calculator" | "client" | "brand">("calculator");
  const [businessName, setBusinessName] = useState(BRANDING.businessName);
const [businessLogo, setBusinessLogo] = useState<string | null>(null);
  const [isPro, setIsPro] = useState(false);

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
    <main className="no-print mx-auto flex min-h-screen max-w-6xl flex-col gap-8 px-4 pb-12 pt-10 sm:px-6 lg:px-10">
      <section className="rounded-3xl bg-gradient-to-br from-brand-cream via-white to-brand-peach/30 p-7 shadow-card ring-1 ring-slate-100 backdrop-blur sm:p-10">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
          <div className="space-y-3">
            <p className="text-xs uppercase tracking-wide text-slate-500">
              {copy.general.tagline}
            </p>

            <h1 className="text-3xl font-black text-brand-slate sm:text-4xl">
              {copy.general.appTitle}
            </h1>

            <p className="max-w-2xl text-sm leading-relaxed text-slate-600">
              {copy.general.tagline}{" "}
              <code className="mx-1 rounded bg-slate-100 px-1">
                src/lib/pricing.ts
              </code>{" "}
              <code className="mx-1 rounded bg-slate-100 px-1">
                src/lib/ingredients.ts
              </code>.
            </p>
          </div>

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
      </section>

      {/* DOWNLOAD */}
      <section className="rounded-3xl border border-slate-100 bg-gradient-to-r from-brand-cream via-white to-brand-peach/30 p-6 shadow-card backdrop-blur sm:flex sm:items-center sm:justify-between sm:p-7">
        <div className="space-y-2">
          <p className="text-xs uppercase tracking-wide text-slate-500">{copy.download.label}</p>
          <h2 className="text-lg font-bold text-brand-slate">{copy.download.title}</h2>
          <p className="max-w-3xl text-sm leading-relaxed text-slate-600">{copy.download.description}</p>
        </div>

        <a
          className="mt-4 inline-flex items-center justify-center rounded-full bg-brand-slate px-4 py-2 text-sm font-semibold text-white shadow-lg transition hover:-translate-y-0.5 hover:bg-brand-slate/90 sm:mt-0"
          href="/cake-pricing-app.zip"
          download
        >
          {copy.download.button}
        </a>
      </section>

      {/* MODE */}
      <section className="rounded-3xl border border-slate-100 bg-white/80 p-6 shadow-card backdrop-blur sm:flex sm:items-center sm:justify-between sm:p-7">
        <div className="space-y-2">
          <p className="text-xs uppercase tracking-wide text-slate-500">{copy.modes.label}</p>
          <h2 className="text-lg font-bold text-brand-slate">{copy.modes.title}</h2>
          <p className="max-w-3xl text-sm leading-relaxed text-slate-600">{copy.modes.description}</p>
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

      {/* ADVANCED HELPERS */}
      {mode === "advanced" ? (
        <section className="space-y-4">
          <IngredientManager ingredients={ingredients} onAdd={handleAddIngredient} onUpdate={handleUpdateIngredient} onDelete={handleDeleteIngredient} />
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
</div>

      {/* CALCULATOR TAB */}
      {activeTab === "calculator" ? (
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
        <section className="space-y-4">
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
            <p className="mt-1 text-[10px] text-slate-400">{copy.client.clientMessageLocked}
</p>
          </div>

          {/* TARJETA CLIENTE */}
          {pricing.recommendedPrice > 0 ? (
            <div className="quote-print relative mt-6 rounded-3xl border border-slate-200 bg-white p-5 shadow-lg max-w-[420px] mx-auto">
              <div className="absolute right-3 top-3 rounded-full bg-slate-100 px-3 py-1 text-[11px] font-bold uppercase tracking-wide text-slate-600">
                {copy.client.freeBadge}
              </div>

              {businessLogo ? (
  <div className="mb-3 flex justify-center">
    <img
      src={businessLogo}
      alt={businessName}
      className="h-10 object-contain print:h-8"
    />
  </div>
) : (
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

              <h3 className="text-xl font-black text-brand-slate">{copy.client.quoteTitle}</h3>

              <p className="mt-1 text-sm text-slate-500">{selectedSize.servings} {copy.client.servingsLabel}</p>

              <div className="mt-4 rounded-2xl bg-brand-cream/40 p-4 text-center">
                <p className="text-xs uppercase tracking-wide text-slate-500">
  {copy.client.totalLabel}
</p>
                <p className="text-3xl font-black text-brand-slate">${pricing.recommendedPrice.toFixed(2)}</p>
              </div>

              {pricing.deliveryFee > 0 ? (
                <div className="mt-3 flex justify-between text-sm text-slate-600">
                  <span>{copy.client.deliveryLabel}</span>
                  <span>${pricing.deliveryFee.toFixed(2)}</span>
                </div>
              ) : null}

              {clientMessage ? (
                <div className="mt-4 rounded-xl bg-slate-50 p-3 text-xs text-slate-600">{clientMessage}</div>
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
  className="mt-4 w-full rounded-xl bg-brand-slate px-4 py-3 text-sm font-semibold text-white"
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

              <p style={{ fontSize: "14px", marginBottom: "8px" }}>{selectedSize.servings} {copy.client.servingsLabel}</p>

              <p style={{ fontSize: "28px", fontWeight: "800", margin: "12px 0" }}>
                ${pricing.recommendedPrice.toFixed(2)}
              </p>

              {pricing.deliveryFee > 0 ? (
                <p style={{ fontSize: "14px" }}>Delivery: ${pricing.deliveryFee.toFixed(2)}</p>
              ) : null}

              {clientMessage ? (
                <p style={{ fontSize: "12px", marginTop: "12px", color: "#555" }}>{clientMessage}</p>
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
              {isPro ? copy.client.customMessageLabel : copy.client.clientMessageLocked}
            </p>    
          </div>

          <button
            type="button"
            onClick={() => setIsPro((prev) => !prev)}
            className="mt-2 text-[10px] underline text-slate-400"
          >
            {copy.client.devTogglePro}
          </button>

          <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-4 text-xs leading-relaxed text-slate-600">
            <p className="font-semibold text-brand-slate">{copy.recipeInfo.title}</p>
            <ul className="mt-2 list-disc space-y-1 pl-4">
              {copy.recipeInfo.items.map((item: string) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>

          <ProFeatures />

          {!hasCalculated ? <p className="text-xs text-slate-500">{copy.recipeInfo.cta}</p> : null}
        </section>
      ) : null}

      {/* BRAND TAB */}
      {activeTab === "brand" ? (
        <section className="mx-auto max-w-md space-y-4">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow">
            <h3 className="mb-1 text-lg font-bold text-brand-slate">{copy.brand.title}</h3>
            <p className="mb-4 text-sm text-slate-500">{copy.brand.description}</p>

            <div className="mb-4">
              <label className="mb-1 block text-sm font-semibold text-slate-600">{copy.brand.businessName}</label>
              <input
                type="text"
                value={BRANDING.businessName}
                disabled
                className="w-full rounded-xl border border-slate-300 bg-slate-100 p-3 text-sm text-slate-600 cursor-not-allowed"
              />
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
        </section>
      ) : null}
    </main>
  );
}
 
