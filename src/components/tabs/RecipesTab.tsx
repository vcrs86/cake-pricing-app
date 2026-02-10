import { IngredientManager } from "@/components/IngredientManager";
import { RecipeBuilder, type RecipeLineInput } from "@/components/RecipeBuilder";
import type { Ingredient } from "@/lib/ingredients";
import { useLanguage } from "@/lib/i18n";
import type { Recipe } from "@/lib/types/Recipe";
import { ProLockedOverlay } from "@/components/ProLockedOverlay";

type RecipesTabProps = {
  ingredients: Ingredient[];
  recipeLines: RecipeLineInput[];
  onAddIngredient: (ingredient: Ingredient) => void;
  onUpdateIngredient: (id: string, patch: Partial<Ingredient>) => void;
  onDeleteIngredient: (id: string) => void;
  onAddLine: () => void;
  onChangeLine: (id: string, patch: Partial<RecipeLineInput>) => void;
  onRemoveLine: (id: string) => void;
  lineCosts: Array<{ lineId: string; total: number }>;
  totalIngredientsCost: number;
  recipeName: string;
  setRecipeName: (value: string) => void;
  onSaveRecipe: () => void;
  savedRecipes: Recipe[];
  isPro: boolean;
  formatCurrency: (value: number) => string;
  currency: string;
  onUseRecipe: (recipe: Recipe) => void;
  onDeleteRecipe: (id: string) => void;
  recipeSearchTerm: string;
  setRecipeSearchTerm: (value: string) => void;
  onUpgrade: () => void;
};

export function RecipesTab({
  ingredients,
  recipeLines,
  onAddIngredient,
  onUpdateIngredient,
  onDeleteIngredient,
  onAddLine,
  onChangeLine,
  onRemoveLine,
  lineCosts,
  totalIngredientsCost,
  recipeName,
  setRecipeName,
  onSaveRecipe,
  savedRecipes,
  isPro,
  formatCurrency,
  currency,
  onUseRecipe,
  onDeleteRecipe,
  recipeSearchTerm,
  setRecipeSearchTerm,
  onUpgrade,
}: RecipesTabProps) {
  const { copy } = useLanguage();
  const filteredRecipes = savedRecipes.filter((recipe) =>
    recipe.name.toLowerCase().includes(recipeSearchTerm.toLowerCase()),
  );

  return (
    <div className="space-y-8">
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
          onAdd={onAddIngredient}
          onUpdate={onUpdateIngredient}
          onDelete={onDeleteIngredient}
          formatCurrency={formatCurrency}
          copy={copy}
          currency={currency}
        />
      </section>

      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <div className="mb-6">
          <h3 className="text-xl font-bold text-brand-slate">
            🥣 {copy.recipeBuilder?.title || "Costo por receta"}
          </h3>
          <p className="text-sm text-slate-500">
            {copy.recipeBuilder?.empty || "Agrega ingredientes y cantidades."}
          </p>
        </div>

        <RecipeBuilder
          ingredients={ingredients}
          lines={recipeLines}
          onAddLine={onAddLine}
          onChangeLine={onChangeLine}
          onRemoveLine={onRemoveLine}
          lineCosts={lineCosts as any}
          totalCost={totalIngredientsCost}
        />
      </section>

      {/* SAVE RECIPE */}
<div className="relative">
  {/* FORMULARIO */}
  <div className={!isPro ? "pointer-events-none opacity-50" : ""}>
    <div className="rounded-xl border border-dashed border-brand-rose/30 bg-brand-rose/5 p-4 space-y-3">

      <h3 className="text-xs font-semibold text-brand-slate uppercase tracking-wide">
        💾 {copy.recipes.saveTitle}
      </h3>

      <p className="text-xs text-slate-600">
        {copy.recipes.saveDescription}
      </p>

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
            : "border-slate-300 bg-slate-100 text-slate-500 cursor-not-allowed"
        }`}
      />

      <button
        type="button"
        onClick={onSaveRecipe}
        disabled={!isPro}
        className={`w-full rounded-xl px-4 py-3 text-sm font-semibold transition ${
          isPro
            ? "bg-brand-slate text-white hover:-translate-y-0.5 hover:shadow-lg"
            : "bg-slate-300 text-slate-500 cursor-not-allowed"
        }`}
      >
        {isPro ? copy.recipes.saveButton : copy.recipes.proLocked}
      </button>

    </div>
  </div>

  {/* OVERLAY SOLO FREE */}
  {!isPro && (
    <div className="absolute inset-0 flex items-center justify-center rounded-xl bg-white/70 backdrop-blur-sm">
      <ProLockedOverlay
        description={copy.recipes.proLocked}
        onUpgrade={onUpgrade}
      />
    </div>
  )}
</div>

<div className="space-y-4">
        {isPro && savedRecipes.length > 0 && (
          <div className="relative">
            <input
              type="text"
              value={recipeSearchTerm}
              onChange={(e) => setRecipeSearchTerm(e.target.value)}
              placeholder={copy.recipes?.searchPlaceholder || "Buscar receta..."}
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm shadow-sm focus:border-brand-rose focus:ring-1 focus:ring-brand-rose outline-none"
            />
          </div>
        )}

        {isPro && filteredRecipes.length > 0 && (
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
                  <button
                    type="button"
                    onClick={() => onUseRecipe(recipe)}
                    className="flex-1 rounded-lg bg-brand-slate px-3 py-2 text-xs font-semibold text-white hover:shadow"
                  >
                    {copy.recipes.use}
                  </button>
                  <button
                    type="button"
                    onClick={() => onDeleteRecipe(recipe.id)}
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
      </div>
  );
}