import type { Recipe } from "@/lib/types/Recipe";

const STORAGE_KEY = "cakeprice_recipes";

export function loadRecipes(): Recipe[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as Recipe[]) : [];
  } catch {
    window.localStorage.removeItem(STORAGE_KEY);
    return [];
  }
}

export function saveRecipes(recipes: Recipe[]) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(recipes));
}

export function clearRecipes() {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(STORAGE_KEY);
}
