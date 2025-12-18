"use client";

import { CAKE_SIZES, type CakeSize, type ComplexityLevel } from "@/lib/pricing";
import { useMemo } from "react";
import { useLanguage } from "@/lib/i18n";
import { Clock } from "lucide-react";
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
  const { copy } = useLanguage();
  const sizeOptions: CakeSize[] = useMemo(() => CAKE_SIZES, []);
  const isBasic = mode === "basic";

  const complexityOptions = isBasic
    ? [
        { value: "basic", label: copy.calculatorForm.complexityOptions.basic },
        { value: "intermediate", label: copy.calculatorForm.complexityOptions.intermediate },
        { value: "advanced", label: copy.calculatorForm.complexityOptions.advanced },
      ]
    : [
        { value: "basic", label: copy.calculatorForm.complexityOptions.basic },
        { value: "intermediate", label: copy.calculatorForm.complexityOptions.intermediate },
        { value: "advanced", label: copy.calculatorForm.complexityOptions.advanced },
        { value: "very_complex", label: copy.calculatorForm.complexityOptions.veryComplex },
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
          <h2 className="mb-4 text-lg font-bold text-brand-slate">{copy.calculatorForm.quickIngredients}</h2>
          <p className="mb-3 text-sm text-slate-600">
            {copy.calculatorForm.quickIngredientsHelper}
          </p>
          <div className="max-w-sm">
            <Field
              label={copy.calculatorForm.ingredientCost}
              prefix="$"
              inputMode="decimal"
              value={values.basicIngredientsCost}
              onChange={(value) => onChange("basicIngredientsCost", value)}
              help={copy.calculatorForm.quickHelp}
            />
          </div>
        </div>
      ) : null}

      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-card sm:p-6">
        <h2 className="mb-4 flex items-center gap-2 text-lg font-bold text-brand-slate">
  <Clock className="h-5 w-5 text-brand-rose/80" />
  {copy.calculatorForm.coreDetails}
</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700">{copy.calculatorForm.cakeSize}</label>
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
              label={copy.calculatorForm.decorationCost}
              prefix="$"
              inputMode="decimal"
              value={values.decorationCost}
              onChange={(value) => onChange("decorationCost", value)}
              help={copy.calculatorForm.decorationCostHelp}
            />
          ) : null}
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <Field
            label={copy.calculatorForm.hoursWorked}
            suffix="hrs"
            inputMode="decimal"
            value={values.hoursWorked}
            onChange={(value) => onChange("hoursWorked", value)}
          />
          <Field
            label={copy.calculatorForm.hourlyRate}
            prefix="$"
            inputMode="decimal"
            value={values.hourlyRate}
            onChange={(value) => onChange("hourlyRate", value)}
          />
          <Field
            label={copy.calculatorForm.complexity}
            value={values.decorationComplexity}
            onChange={(value) => onChange("decorationComplexity", value)}
            isSelect
            options={complexityOptions}
            help={copy.calculatorForm.complexityHelp}
          />
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-card sm:p-6">
        <h2 className="mb-4 text-lg font-bold text-brand-slate">{copy.calculatorForm.extras}</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field
            label={copy.calculatorForm.cakeTopper}
            prefix="$"
            inputMode="decimal"
            value={values.cakeTopper}
            onChange={(value) => onChange("cakeTopper", value)}
          />
          {isBasic ? null : (
            <Field
              label={copy.calculatorForm.sugarFlowers}
              prefix="$"
              inputMode="decimal"
              value={values.sugarFlowers}
              onChange={(value) => onChange("sugarFlowers", value)}
            />
          )}
          <Field
            label={copy.calculatorForm.freshFlowers}
            prefix="$"
            inputMode="decimal"
            value={values.freshFlowers}
            onChange={(value) => onChange("freshFlowers", value)}
          />
          {isBasic ? null : (
            <Field
              label={copy.calculatorForm.figures3d}
              prefix="$"
              inputMode="decimal"
              value={values.figures3d}
              onChange={(value) => onChange("figures3d", value)}
            />
          )}
        </div>
        {isBasic ? (
          <p className="mt-2 text-xs text-slate-500">{copy.calculatorForm.extrasHint}</p>
        ) : null}
      </div>

      {!isBasic ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-card sm:p-6">
          <h2 className="mb-4 text-lg font-bold text-brand-slate">{copy.calculatorForm.additionalServices}</h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <Field
              label={copy.calculatorForm.setupHours}
              suffix="hrs"
              inputMode="decimal"
              value={values.setupHours}
              onChange={(value) => onChange("setupHours", value)}
            />
            <Field
              label={copy.calculatorForm.setupRate}
              prefix="$"
              inputMode="decimal"
              value={values.setupRate}
              onChange={(value) => onChange("setupRate", value)}
            />
            <Field
              label={copy.calculatorForm.deliveryFee}
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
          <span>{copy.calculatorForm.profitMargin}</span>
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
        <p className="mt-1 text-xs text-slate-500">{copy.calculatorForm.profitNote}</p>
      </div>

      <button
        type="submit"
        className="flex w-full items-center justify-center gap-2 rounded-xl bg-brand-slate px-4 py-3 text-sm font-semibold text-white shadow-card transition hover:-translate-y-0.5 hover:shadow-lg active:translate-y-0"
      >
        {copy.calculatorForm.submit}
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
