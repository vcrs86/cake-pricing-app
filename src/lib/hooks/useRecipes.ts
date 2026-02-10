import { useEffect, useMemo, useState } from "react";
import type { Recipe } from "@/lib/types/Recipe";
import { clearRecipes, loadRecipes, saveRecipes } from "@/lib/storage/recipeStorage";

export function useRecipes(isPro: boolean) {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [activeRecipeId, setActiveRecipeId] = useState<string | null>(null);

  useEffect(() => {
    if (!isPro) {
      setRecipes([]);
      setActiveRecipeId(null);
      return;
    }
    setRecipes(loadRecipes());
  }, [isPro]);

  useEffect(() => {
    if (!isPro) return;
    saveRecipes(recipes);
  }, [recipes, isPro]);

  const activeRecipe = useMemo(
    () => recipes.find((recipe) => recipe.id === activeRecipeId) ?? null,
    [recipes, activeRecipeId],
  );

  const upsertRecipe = (recipe: Recipe) => {
    setRecipes((prev) => {
      const exists = prev.some((item) => item.id === recipe.id);
      return exists
        ? prev.map((item) => (item.id === recipe.id ? recipe : item))
        : [recipe, ...prev];
    });
  };

  const removeRecipe = (id: string) => {
    setRecipes((prev) => prev.filter((item) => item.id !== id));
    if (activeRecipeId === id) {
      setActiveRecipeId(null);
    }
  };

  const clearAll = () => {
    clearRecipes();
    setRecipes([]);
    setActiveRecipeId(null);
  };

  return {
    recipes,
    activeRecipe,
    activeRecipeId,
    setActiveRecipeId,
    setRecipes,
    upsertRecipe,
    removeRecipe,
    clearAll,
  };
}
