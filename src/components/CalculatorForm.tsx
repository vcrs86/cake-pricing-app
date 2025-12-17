"use client";

import { CAKE_SIZES, type CakeSize, type ComplexityLevel } from "@/lib/pricing";
import { useMemo } from "react";

type FormState = {
  cakeSize: string;
  basicIngredientsCost: string;
  decorationCost: string;
  hoursWorked: string;
  hourlyRate: string;
  setupHours: string;
  setupRate: string;
  profitMargin: string;
  deliveryFee: string;
  decorationComplexity: ComplexityLevel;
  cakeTopper: string;
  sugarFlowers: string;
  freshFlowers: string;
  figures3d: string;
};

type CalculatorFormProps = {
  mode: "basic" | "advanced";
  values: FormState;
  onChange: (field: keyof FormState, value: string) => void;
  onSubmit: () => void;
};

const numberInputClasses =
  "w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-800 shadow-sm focus:border-brand-rose focus:outline-none focus:ring-2 focus:ring-brand-rose/50";

export function CalculatorForm({ mode, values, onChange, onSubmit }: CalculatorFormProps) {
  const sizeOptions: CakeSize[] = useMemo(() => CAKE_SIZES, []);
  const isBasic = mode === "basic";

  const complexityOptions = isBasic
    ? [
        { value: "basic", label: "Basic" },
        { value: "intermediate", label: "Intermediate (+10%)" },
        { value: "advanced", label: "Advanced (+25%)" },
      ]
    : [
        { value: "basic", label: "Basic" },
        { value: "intermediate", label: "Intermediate (+10%)" },
        { value: "advanced", label: "Advanced (+25%)" },
        { value: "very_complex", label: "Very complex (+40%)" },
      ];

  return (
    <form
      className="space-y-5"
      onSubmit={(event) => {
        event.preventDefault();
        onSubmit();
      }}
    >
      {isBasic ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-card sm:p-6">
          <h2 className="mb-4 text-lg font-bold text-brand-slate">Ingredients (quick total)</h2>
          <p className="mb-3 text-sm text-slate-600">
            Enter a rough total for ingredients. Switch to Advanced mode to price each ingredient by quantity.
          </p>
          <div className="max-w-sm">
            <Field
              label="Ingredient cost"
              prefix="$"
              inputMode="decimal"
              value={values.basicIngredientsCost}
              onChange={(value) => onChange("basicIngredientsCost", value)}
              help="Use the latest shopping list subtotal or a quick estimate."
            />
          </div>
        </div>
      ) : null}

      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-card sm:p-6">
        <h2 className="mb-4 text-lg font-bold text-brand-slate">Core project details</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700">Cake size</label>
            <div className="rounded-xl border border-slate-200 bg-white shadow-sm">
              <select
                className="w-full rounded-xl bg-white px-4 py-3 text-sm font-semibold text-slate-800 focus:border-brand-rose focus:outline-none"
                value={values.cakeSize}
                onChange={(e) => onChange("cakeSize", e.target.value)}
              >
                {sizeOptions.map((option) => (
                  <option key={option.id} value={option.id}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {!isBasic ? (
            <Field
              label="Decoration materials (non-ingredients)"
              prefix="$"
              inputMode="decimal"
              value={values.decorationCost}
              onChange={(value) => onChange("decorationCost", value)}
              help="Fondant sheets, buttercream, boxes, boards — anything not tracked as an ingredient above."
            />
          ) : null}
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <Field
            label="Hours for baking/decorating"
            suffix="hrs"
            inputMode="decimal"
            value={values.hoursWorked}
            onChange={(value) => onChange("hoursWorked", value)}
          />
          <Field
            label="Hourly rate"
            prefix="$"
            inputMode="decimal"
            value={values.hourlyRate}
            onChange={(value) => onChange("hourlyRate", value)}
          />
          <Field
            label="Decoration complexity"
            value={values.decorationComplexity}
            onChange={(value) => onChange("decorationComplexity", value)}
            isSelect
            options={complexityOptions}
            help="Applies a multiplier to decoration costs and labor to reflect intricacy."
          />
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-card sm:p-6">
        <h2 className="mb-4 text-lg font-bold text-brand-slate">Optional extras</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field
            label="Cake topper"
            prefix="$"
            inputMode="decimal"
            value={values.cakeTopper}
            onChange={(value) => onChange("cakeTopper", value)}
          />
          {isBasic ? null : (
            <Field
              label="Sugar flowers"
              prefix="$"
              inputMode="decimal"
              value={values.sugarFlowers}
              onChange={(value) => onChange("sugarFlowers", value)}
            />
          )}
          <Field
            label="Flowers"
            prefix="$"
            inputMode="decimal"
            value={values.freshFlowers}
            onChange={(value) => onChange("freshFlowers", value)}
          />
          {isBasic ? null : (
            <Field
              label="3D figures"
              prefix="$"
              inputMode="decimal"
              value={values.figures3d}
              onChange={(value) => onChange("figures3d", value)}
            />
          )}
        </div>
        {isBasic ? (
          <p className="mt-2 text-xs text-slate-500">Switch to Advanced for sugar flowers and 3D figure tracking.</p>
        ) : null}
      </div>

      {!isBasic ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-card sm:p-6">
          <h2 className="mb-4 text-lg font-bold text-brand-slate">Additional services</h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <Field
              label="On-site setup hours"
              suffix="hrs"
              inputMode="decimal"
              value={values.setupHours}
              onChange={(value) => onChange("setupHours", value)}
            />
            <Field
              label="Setup hourly rate"
              prefix="$"
              inputMode="decimal"
              value={values.setupRate}
              onChange={(value) => onChange("setupRate", value)}
            />
            <Field
              label="Delivery fee"
              prefix="$"
              inputMode="decimal"
              value={values.deliveryFee}
              onChange={(value) => onChange("deliveryFee", value)}
            />
          </div>
        </div>
      ) : null}

      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-card sm:p-6">
        <label className="mb-2 flex items-center justify-between text-sm font-semibold text-slate-700">
          <span>Profit margin</span>
          <span className="text-xs font-medium text-slate-500">{values.profitMargin || "0"}%</span>
        </label>
        <input
          type="range"
          min={0}
          max={80}
          step={1}
          value={values.profitMargin}
          onChange={(e) => onChange("profitMargin", e.target.value)}
          className="w-full accent-brand-rose"
        />
        <p className="mt-1 text-xs text-slate-500">Commonly 20-40% depending on complexity and demand.</p>
      </div>

      <button
        type="submit"
        className="flex w-full items-center justify-center gap-2 rounded-xl bg-brand-slate px-4 py-3 text-sm font-semibold text-white shadow-card transition hover:-translate-y-0.5 hover:shadow-lg active:translate-y-0"
      >
        Calculate price
      </button>
    </form>
  );
}

type FieldProps = {
  label: string;
  value: string;
  onChange: (value: string) => void;
  prefix?: string;
  suffix?: string;
  inputMode?: "decimal";
  isSelect?: boolean;
  options?: { value: string; label: string }[];
  help?: string;
};

function Field({ label, value, onChange, prefix, suffix, inputMode, isSelect, options, help }: FieldProps) {
  return (
    <label className="block space-y-2 text-sm font-semibold text-slate-700">
      <span>{label}</span>
      <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-3 shadow-sm focus-within:border-brand-rose focus-within:ring-2 focus-within:ring-brand-rose/40">
        {prefix ? <span className="text-slate-400">{prefix}</span> : null}
        {isSelect ? (
          <select
            className="w-full rounded-xl bg-white text-sm font-semibold text-slate-800 focus:border-brand-rose focus:outline-none"
            value={value}
            onChange={(event) => onChange(event.target.value)}
          >
            {options?.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        ) : (
          <input
            className={`${numberInputClasses} border-none px-0 py-0 shadow-none focus:ring-0`}
            inputMode={inputMode}
            type="number"
            value={value}
            min="0"
            step="0.01"
            onChange={(event) => onChange(event.target.value)}
          />
        )}
        {suffix ? <span className="text-slate-400">{suffix}</span> : null}
      </div>
      {help ? <p className="text-xs font-normal text-slate-500">{help}</p> : null}
    </label>
  );
}

export type { FormState as CalculatorFormState };
