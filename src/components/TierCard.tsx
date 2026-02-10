import type { Tier } from "@/lib/types/Tier";
import { useLanguage } from "@/lib/i18n";
import { RecipeSelector } from "@/components/RecipeSelector";
import type { Recipe } from "@/lib/types/Recipe";

type TierCardProps = {
  tier: Tier;
  recipes: Recipe[];
  onChange: (tier: Tier) => void;
};

export function TierCard({ tier, recipes, onChange }: TierCardProps) {
  const { copy } = useLanguage();

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 space-y-3">
      <div className="flex items-center justify-between">
        <p className="text-sm font-semibold text-brand-slate">
          {copy.calculator?.tierLabel ?? "Tier"}
        </p>
      </div>

      <RecipeSelector
        recipes={recipes}
        selectedId={tier.recipeId}
        onChange={(id) => onChange({ ...tier, recipeId: id })}
      />

      <label className="block space-y-1 text-xs font-semibold text-slate-600">
        <span>{copy.calculator?.servingsLabel ?? "Servings"}</span>
        <input
          type="number"
          value={tier.servings || ""}
          onChange={(event) =>
            onChange({
              ...tier,
              servings: event.target.value === "" ? 0 : Number(event.target.value),
            })
          }
          className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
        />
      </label>
    </div>
  );
}
