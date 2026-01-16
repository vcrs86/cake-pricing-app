/**
 * Placeholder helpers for upcoming PRO-grade cost tracking.
 * None of these values are wired into the calculator yet—they exist so future
 * work can slot them into the pricing flow without touching current logic.
 */

export type EnergyCostInput = {
  /** Estimated baking time in hours for a cake or batch. */
  bakingHours: number;
  /** Cost per kWh from the utility bill. */
  costPerKwh: number;
  /** Average oven power draw in kW (e.g., 2.4 for a 2400W oven). */
  ovenPowerKw: number;
};

/**
 * Calculates electricity cost for baking time.
 * This is a PRO placeholder and currently returns 0 so it does not impact the
 * MVP price calculation.
 */
export function estimateEnergyCost(_input: EnergyCostInput): number {
  // TODO(PRO): implement `bakingHours * ovenPowerKw * costPerKwh`
  return 0;
}

export type OperationalExpenseInput = {
  /** Sum of monthly fixed expenses you want to spread across orders. */
  monthlyExpenses: number;
  /** How many cake orders you expect per month to spread the cost over. */
  expectedOrdersPerMonth: number;
};

/**
 * Placeholder for allocating monthly operational expenses per order.
 * Kept at 0 until PRO features are enabled so the current formula stays put.
 */
export function allocateOperationalExpenses(_input: OperationalExpenseInput): number {
  // TODO(PRO): implement `monthlyExpenses / expectedOrdersPerMonth`
  return 0;
}
