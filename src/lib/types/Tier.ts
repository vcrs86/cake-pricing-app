import type { Recipe } from "@/lib/types/Recipe";

export type Tier = {
  id: string;
  recipeId: string;
  recipe?: Recipe;
  servings: number;
  flavor?: string;
  shape?: "round" | "square" | "rectangular";
  sizeLabel?: string;
  complexity?: "basic" | "intermediate" | "advanced" | "very_complex";
};
