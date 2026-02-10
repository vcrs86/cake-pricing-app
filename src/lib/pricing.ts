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

export type ComplexityLevel = "basic" | "intermediate" | "advanced" | "very_complex";

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
  const recipeCost = inputs.recipe && inputs.ingredientCatalog
    ? calculateRecipeCost(inputs.ingredientCatalog, inputs.recipe).total
    : 0;

  const ingredientCost = toCurrency(Math.max(inputs.ingredientsCost, 0) + recipeCost);
  const extrasCost = Math.max(inputs.decorationExtras, 0);
  const laborCost =
    Math.max(inputs.hoursWorked, 0) * Math.max(inputs.hourlyRate, 0) +
    Math.max(inputs.setupHours, 0) * Math.max(inputs.setupRate, 0);

  const decorationAndLabor = Math.max(inputs.decorationCost, 0) + extrasCost + laborCost;
  const complexityMultiplier = COMPLEXITY_MULTIPLIER[inputs.decorationComplexity] ?? 1;
  const adjustedDecorAndLabor = decorationAndLabor * complexityMultiplier;

  const baseCost = ingredientCost + adjustedDecorAndLabor + Math.max(inputs.deliveryFee, 0);
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
  const safeBaseServings = Math.max(baseServings, 0);

  const tierResults = tiers.map((tier) => {
    const safeServings = Math.max(tier.servings, 0);
    const factor = safeBaseServings > 0 ? safeServings / safeBaseServings : 0;

    const scaledPricing = calculatePricing({
      ...baseInputs,
      ingredientsCost: baseInputs.ingredientsCost * factor,
      decorationCost: baseInputs.decorationCost * factor,
      decorationExtras: baseInputs.decorationExtras * factor,
      hoursWorked: baseInputs.hoursWorked * factor,
      setupHours: baseInputs.setupHours * factor,
      deliveryFee: 0,
      servings: safeServings || undefined,
    });

    return {
      size: tier.size,
      servings: safeServings,
      factor,
      cost: scaledPricing.recommendedPrice,
      pricing: scaledPricing,
    };
  });

  const combinedPricing = tierResults.reduce<PricingBreakdown>(
    (acc, tier) => ({
      ingredientsCost: acc.ingredientsCost + tier.pricing.ingredientsCost,
      decorationAndLabor: acc.decorationAndLabor + tier.pricing.decorationAndLabor,
      laborCost: acc.laborCost + tier.pricing.laborCost,
      complexityMultiplier: acc.complexityMultiplier,
      extrasCost: acc.extrasCost + tier.pricing.extrasCost,
      deliveryFee: 0,
      baseCost: acc.baseCost + tier.pricing.baseCost,
      profitAmount: acc.profitAmount + tier.pricing.profitAmount,
      suggestedMinimum: acc.suggestedMinimum + tier.pricing.suggestedMinimum,
      recommendedPrice: acc.recommendedPrice + tier.pricing.recommendedPrice,
      pricePerServing: undefined,
    }),
    {
      ingredientsCost: 0,
      decorationAndLabor: 0,
      laborCost: 0,
      complexityMultiplier:
        COMPLEXITY_MULTIPLIER[baseInputs.decorationComplexity] ?? 1,
      extrasCost: 0,
      deliveryFee: 0,
      baseCost: 0,
      profitAmount: 0,
      suggestedMinimum: 0,
      recommendedPrice: 0,
      pricePerServing: undefined,
    }
  );

  const totalCost = toCurrency(combinedPricing.baseCost + Math.max(deliveryFee, 0));
  const totalPrice = toCurrency(combinedPricing.recommendedPrice + Math.max(deliveryFee, 0));

  return {
    tiers: tierResults.map(({ pricing, ...tier }) => tier),
    totalCost,
    totalPrice,
    combinedPricing: {
      ...combinedPricing,
      deliveryFee: toCurrency(Math.max(deliveryFee, 0)),
      baseCost: toCurrency(combinedPricing.baseCost + Math.max(deliveryFee, 0)),
      suggestedMinimum: toCurrency(
        combinedPricing.suggestedMinimum + Math.max(deliveryFee, 0)
      ),
      recommendedPrice: totalPrice,
    },
  };
}