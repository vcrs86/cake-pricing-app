import type { Ingredient, RecipeLine } from "./ingredients";
import { calculateRecipeCost } from "./ingredients";

export type CakeSize = {
  id: string;
  label: string;
  servings: number;
  note?: string;
};

export const CAKE_SIZES: CakeSize[] = [
  { id: "6-round", label: "6\" round (10 servings)", servings: 10 },
  { id: "8-round", label: "8\" round (20 servings)", servings: 20 },
  { id: "10-round", label: "10\" round (28 servings)", servings: 28 },
  { id: "quarter-sheet", label: "Quarter sheet (25 servings)", servings: 25 },
  { id: "half-sheet", label: "Half sheet (50 servings)", servings: 50 },
];

export type ComplexityLevel =
  | "basic"
  | "intermediate"
  | "advanced"
  | "very_complex";

export const COMPLEXITY_MULTIPLIER: Record<ComplexityLevel, number> = {
  basic: 1,
  intermediate: 1.1,
  advanced: 1.25,
  very_complex: 1.4,
};

export type PricingInputs = {
  ingredientsCost: number;
  decorationCost: number;
  decorationExtras: number;
  decorationComplexity: ComplexityLevel;
  recipe?: RecipeLine[];
  ingredientCatalog?: Ingredient[];
  hoursWorked: number;
  hourlyRate: number;
  setupHours: number;
  setupRate: number;
  deliveryFee: number;
  profitMargin: number;
  servings?: number;
};

export type PricingBreakdown = {
  ingredientsCost: number;
  decorationAndLabor: number;
  laborCost: number;
  complexityMultiplier: number;
  extrasCost: number;
  deliveryFee: number;
  baseCost: number;
  profitAmount: number;
  suggestedMinimum: number;
  recommendedPrice: number;
  pricePerServing?: number;
};

export type TieredPricingTier = {
  size: string;
  servings: number;
  factor: number;
  cost: number;
};

export type TieredPricingResult = {
  tiers: TieredPricingTier[];
  totalCost: number;
  totalPrice: number;
  combinedPricing: PricingBreakdown;
};

const toCurrency = (value: number) => Math.round(value * 100) / 100;

export function calculatePricing(inputs: PricingInputs): PricingBreakdown {
  const recipeCost =
    inputs.recipe && inputs.ingredientCatalog
      ? calculateRecipeCost(inputs.ingredientCatalog, inputs.recipe).total
      : 0;

  const ingredientCost = toCurrency(
    Math.max(inputs.ingredientsCost, 0) + recipeCost
  );

  const extrasCost = Math.max(inputs.decorationExtras, 0);

  const laborCost =
    Math.max(inputs.hoursWorked, 0) * Math.max(inputs.hourlyRate, 0) +
    Math.max(inputs.setupHours, 0) * Math.max(inputs.setupRate, 0);

  const decorationAndLabor =
    Math.max(inputs.decorationCost, 0) + extrasCost + laborCost;

  const complexityMultiplier =
    COMPLEXITY_MULTIPLIER[inputs.decorationComplexity] ?? 1;

  const adjustedDecorAndLabor = decorationAndLabor * complexityMultiplier;

  const baseCost =
    ingredientCost +
    adjustedDecorAndLabor +
    Math.max(inputs.deliveryFee, 0);

  const profitAmount = baseCost * (Math.max(inputs.profitMargin, 0) / 100);
  const suggestedMinimum = baseCost + profitAmount;

  const contingency = baseCost * 0.07;
  const recommendedPrice = suggestedMinimum + contingency;

  const pricePerServing = inputs.servings
    ? recommendedPrice / Math.max(inputs.servings, 1)
    : undefined;

  return {
    ingredientsCost: toCurrency(ingredientCost),
    decorationAndLabor: toCurrency(adjustedDecorAndLabor),
    laborCost: toCurrency(laborCost),
    extrasCost: toCurrency(extrasCost),
    complexityMultiplier,
    deliveryFee: toCurrency(Math.max(inputs.deliveryFee, 0)),
    baseCost: toCurrency(baseCost),
    profitAmount: toCurrency(profitAmount),
    suggestedMinimum: toCurrency(suggestedMinimum),
    recommendedPrice: toCurrency(recommendedPrice),
    pricePerServing: pricePerServing ? toCurrency(pricePerServing) : undefined,
  };
}

export function calculateTieredPricing({
  baseInputs,
  tiers,
  baseServings,
  deliveryFee,
}: {
  baseInputs: PricingInputs;
  tiers: Array<{ size: string; servings: number }>;
  baseServings: number;
  deliveryFee: number;
}): TieredPricingResult {
  const safeBaseServings = Math.max(baseServings, 1);
  const complexityMultiplier =
    COMPLEXITY_MULTIPLIER[baseInputs.decorationComplexity] ?? 1;

  const tierResults = tiers.map((tier) => {
    const safeServings = Math.max(tier.servings, 0);
    const factor = safeServings / safeBaseServings;

    const recipeCost =
      baseInputs.recipe && baseInputs.ingredientCatalog
        ? calculateRecipeCost(
            baseInputs.ingredientCatalog,
            baseInputs.recipe
          ).total * factor
        : 0;

    const ingredientsCost = toCurrency(
      Math.max(baseInputs.ingredientsCost, 0) * factor + recipeCost
    );

    const baseCost = toCurrency(ingredientsCost);

    return {
      size: tier.size,
      servings: safeServings,
      factor,
      cost: baseCost,
      pricing: {
        ingredientsCost,
        decorationAndLabor: 0,
        laborCost: 0,
        complexityMultiplier: 1,
        extrasCost: 0,
        deliveryFee: 0,
        baseCost,
        profitAmount: 0,
        suggestedMinimum: baseCost,
        recommendedPrice: baseCost,
        pricePerServing:
          safeServings > 0 ? toCurrency(baseCost / safeServings) : undefined,
      },
    };
  });

  const ingredientsTotal = toCurrency(
    tierResults.reduce((sum, tier) => sum + tier.pricing.ingredientsCost, 0)
  );

  const laborCost = toCurrency(
    Math.max(baseInputs.hoursWorked, 0) * Math.max(baseInputs.hourlyRate, 0)
  );

  const setupCost = toCurrency(
    Math.max(baseInputs.setupHours, 0) * Math.max(baseInputs.setupRate, 0)
  );

  const extrasCost = toCurrency(Math.max(baseInputs.decorationExtras, 0));
  const decorationCost = toCurrency(Math.max(baseInputs.decorationCost, 0));

  const decorationAndLaborRaw =
    decorationCost + extrasCost + laborCost + setupCost;

  const decorationAndLabor = toCurrency(
    decorationAndLaborRaw * complexityMultiplier
  );

  const deliveryCost = toCurrency(Math.max(deliveryFee, 0));

  const baseCost = toCurrency(
    ingredientsTotal + decorationAndLabor + deliveryCost
  );

  const profitAmount = toCurrency(
    baseCost * (Math.max(baseInputs.profitMargin, 0) / 100)
  );

  const suggestedMinimum = toCurrency(baseCost + profitAmount);

  const contingency = toCurrency(baseCost * 0.07);

  const recommendedPrice = toCurrency(suggestedMinimum + contingency);

  const totalServings = tierResults.reduce(
    (sum, tier) => sum + tier.servings,
    0
  );

  return {
    tiers: tierResults.map(({ pricing, ...tier }) => ({
      ...tier,
      cost: pricing.baseCost,
    })),
    totalCost: baseCost,
    totalPrice: recommendedPrice,
    combinedPricing: {
      ingredientsCost: ingredientsTotal,
      decorationAndLabor,
      laborCost: toCurrency(laborCost + setupCost),
      complexityMultiplier,
      extrasCost,
      deliveryFee: deliveryCost,
      baseCost,
      profitAmount,
      suggestedMinimum,
      recommendedPrice,
      pricePerServing:
        totalServings > 0 ? toCurrency(recommendedPrice / totalServings) : undefined,
    },
  };
}