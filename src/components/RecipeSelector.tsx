import type { Recipe } from "@/lib/types/Recipe";
import { useLanguage } from "@/lib/i18n";

type RecipeSelectorProps = {
  recipes: Recipe[];
  selectedId: string | null;
  onChange: (id: string) => void;
  disabled?: boolean;
  placeholder?: string;
};

export function RecipeSelector({
  recipes,
  selectedId,
  onChange,
  disabled,
  placeholder,
}: RecipeSelectorProps) {
  const { copy } = useLanguage();
  const label = copy.recipes?.recipeSelectLabel ?? "Recipe";
  const emptyLabel = placeholder ?? copy.recipes?.selectPlaceholder ?? "Select a recipe";

  return (
    <label className="block space-y-1 text-xs font-semibold text-slate-600">
      <span>{label}</span>
      <select
        value={selectedId ?? ""}
        disabled={disabled}
        onChange={(event) => onChange(event.target.value)}
        className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm"
      >
        <option value="">{emptyLabel}</option>
        {recipes.map((recipe) => (
          <option key={recipe.id} value={recipe.id}>
            {recipe.name}
          </option>
        ))}
      </select>
    </label>
  );
}
