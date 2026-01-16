export type UnitType = "g" | "ml" | "unit" | "oz" | "lb";

export type Ingredient = {
  id: string;
  name: string;
  unit: UnitType;
  packageSize: number;
  packageCost: number;
  costPerUnit: number;
};

export type RecipeLine = {
  id: string;
  ingredientId: string;
  quantity: number;
};

export type RecipeLineCost = {
  lineId: string;
  ingredientName: string;
  unit: UnitType;
  quantity: number;
  cost: number;
};

const toCurrency = (value: number) => Math.round(value * 100) / 100;

export function buildIngredient(params: {
  id: string;
  name: string;
  unit: UnitType;
  packageSize: number;
  packageCost: number;
}): Ingredient {
  const safeSize = Math.max(params.packageSize, 0);
  const safeCost = Math.max(params.packageCost, 0);
  const costPerUnit = safeSize > 0 ? safeCost / safeSize : 0;

  return {
    id: params.id,
    name: params.name.trim(),
    unit: params.unit,
    packageSize: toCurrency(safeSize),
    packageCost: toCurrency(safeCost),
    costPerUnit: Number(costPerUnit.toFixed(4)),
  };
}

export function calculateRecipeCost(
  ingredients: Ingredient[],
  recipe: RecipeLine[]
): { total: number; lines: RecipeLineCost[] } {
  const lookup = new Map<string, Ingredient>();
  ingredients.forEach((ingredient) => lookup.set(ingredient.id, ingredient));

  let total = 0;
  const lines: RecipeLineCost[] = recipe
    .map((line) => {
      const ingredient = lookup.get(line.ingredientId);
      if (!ingredient || !Number.isFinite(line.quantity) || line.quantity <= 0) {
        return undefined;
      }

      const cost = toCurrency(line.quantity * ingredient.costPerUnit);
      total += cost;
      return {
        lineId: line.id,
        ingredientName: ingredient.name,
        unit: ingredient.unit,
        quantity: line.quantity,
        cost,
      } satisfies RecipeLineCost;
    })
    .filter((line): line is RecipeLineCost => Boolean(line));

  return { total: toCurrency(total), lines };
}
