import type { Ingredient } from "@/lib/ingredients";
import type { RecipeLineInput } from "@/components/RecipeBuilder";

export type Recipe = {
  id: string;
  name: string;
  cakeSize?: string;
  ingredients: Ingredient[];
  recipeLines: RecipeLineInput[];
  createdAt: string;
};
