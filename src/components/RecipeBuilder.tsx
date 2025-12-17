"use client";

import { type Ingredient, type RecipeLineCost, type UnitType } from "@/lib/ingredients";
import { useMemo } from "react";

export type RecipeLineInput = {
  id: string;
  ingredientId: string;
  quantity: string;
};

export type RecipeBuilderProps = {
  ingredients: Ingredient[];
  lines: RecipeLineInput[];
  onAddLine: () => void;
  onChangeLine: (id: string, patch: Partial<RecipeLineInput>) => void;
  onRemoveLine: (id: string) => void;
  lineCosts: RecipeLineCost[];
  totalCost: number;
};

export function RecipeBuilder({
  ingredients,
  lines,
  onAddLine,
  onChangeLine,
  onRemoveLine,
  lineCosts,
  totalCost,
}: RecipeBuilderProps) {
  const ingredientLookup = useMemo(() => new Map(ingredients.map((i) => [i.id, i])), [ingredients]);

  return (
    <div className="space-y-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-card sm:p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-wide text-slate-500">Recipe cost calculator</p>
          <h2 className="text-lg font-bold text-brand-slate">Quantity-based costs per cake</h2>
        </div>
        <button
          type="button"
          onClick={onAddLine}
          className="rounded-full bg-brand-rose/15 px-3 py-1 text-xs font-semibold text-brand-slate shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg"
        >
          + Add ingredient
        </button>
      </div>

      {lines.length === 0 ? (
        <p className="rounded-xl bg-slate-50 px-4 py-3 text-sm text-slate-600">
          Add ingredients from your list and enter the quantity used for this cake.
        </p>
      ) : (
        <div className="space-y-3">
          {lines.map((line) => {
            const ingredient = ingredientLookup.get(line.ingredientId);
            const lineCost = lineCosts.find((item) => item.lineId === line.id);

            return (
              <div
                key={line.id}
                className="grid grid-cols-1 gap-3 rounded-xl border border-slate-200 bg-white px-3 py-3 shadow-sm sm:grid-cols-12 sm:items-center"
              >
                <div className="sm:col-span-4">
                  <label className="space-y-1 text-xs font-semibold text-slate-600">
                    <span>Ingredient</span>
                    <select
                      className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-800 shadow-sm focus:border-brand-rose focus:outline-none"
                      value={line.ingredientId}
                      onChange={(event) => onChangeLine(line.id, { ingredientId: event.target.value })}
                    >
                      <option value="">Select ingredient</option>
                      {ingredients.map((option) => (
                        <option key={option.id} value={option.id}>
                          {option.name} (${option.costPerUnit.toFixed(4)} per {option.unit})
                        </option>
                      ))}
                    </select>
                  </label>
                </div>

                <div className="sm:col-span-3">
                  <NumberInput
                    label="Quantity"
                    value={line.quantity}
                    onChange={(value) => onChangeLine(line.id, { quantity: value })}
                    suffix={ingredient ? unitLabel(ingredient.unit) : undefined}
                  />
                </div>

                <div className="sm:col-span-3">
                  <div className="space-y-1 text-xs font-semibold text-slate-600">
                    <span>Cost for this ingredient</span>
                    <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50 px-3 py-3 text-sm font-bold text-brand-slate">
                      {lineCost ? `$${lineCost.cost.toFixed(2)}` : "--"}
                    </div>
                  </div>
                </div>

                <div className="sm:col-span-2 flex items-end justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => onRemoveLine(line.id)}
                    className="text-sm font-semibold text-brand-rose underline decoration-brand-rose/40 decoration-2 underline-offset-4"
                  >
                    Remove
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <div className="flex items-center justify-between rounded-xl bg-slate-50 px-4 py-3 text-sm font-semibold text-brand-slate">
        <span>Total ingredient cost for this recipe</span>
        <span>${totalCost.toFixed(2)}</span>
      </div>
    </div>
  );
}

function NumberInput({
  label,
  value,
  onChange,
  suffix,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  suffix?: string;
}) {
  return (
    <label className="space-y-1 text-xs font-semibold text-slate-600">
      <span>{label}</span>
      <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 shadow-sm focus-within:border-brand-rose focus-within:ring-2 focus-within:ring-brand-rose/40">
        <input
          className="w-full border-none bg-transparent text-sm font-semibold text-slate-800 focus:outline-none"
          type="number"
          inputMode="decimal"
          min={0}
          step={0.01}
          value={value}
          onChange={(event) => onChange(event.target.value)}
        />
        {suffix ? <span className="text-slate-400">{suffix}</span> : null}
      </div>
    </label>
  );
}

function unitLabel(unit: UnitType) {
  switch (unit) {
    case "g":
      return "grams";
    case "ml":
      return "ml";
    case "unit":
      return "unit";
    case "oz":
      return "oz";
    case "lb":
      return "lb";
    default:
      return unit;
  }
}
