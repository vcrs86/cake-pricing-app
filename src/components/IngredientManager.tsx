"use client";

import { useMemo, useState } from "react";
import { buildIngredient, type Ingredient, type UnitType } from "@/lib/ingredients";
import { useLanguage } from "@/lib/i18n";
import { Package } from "lucide-react";
const unitOptions: UnitType[] = ["g", "ml", "unit", "oz", "lb"];

export type IngredientManagerProps = {
  ingredients: Ingredient[];
  onAdd: (ingredient: Ingredient) => void;
  onUpdate: (
    id: string,
    patch: Partial<Pick<Ingredient, "name" | "unit" | "packageSize" | "packageCost">>
  ) => void;
  onDelete: (id: string) => void;
};

export function IngredientManager({ ingredients, onAdd, onUpdate, onDelete }: IngredientManagerProps) {
  const { copy } = useLanguage();
  const [name, setName] = useState("Butter");
  const [unit, setUnit] = useState<UnitType>("g");
  const [packageSize, setPackageSize] = useState("454");
  const [packageCost, setPackageCost] = useState("4.5");

  const canSave = useMemo(
    () => name.trim().length > 1 && Number(packageSize) > 0 && Number(packageCost) >= 0,
    [name, packageCost, packageSize]
  );

  const handleAdd = () => {
    if (!canSave) return;
    const ingredient = buildIngredient({
      id: crypto.randomUUID(),
      name,
      unit,
      packageSize: Number(packageSize),
      packageCost: Number(packageCost),
    });
    onAdd(ingredient);
    setName("");
    setPackageSize("");
    setPackageCost("");
  };

  return (
    <div className="space-y-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-card sm:p-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs uppercase tracking-wide text-slate-500">{copy.ingredientManager.badge}</p>
          <h2 className="flex items-center gap-2 text-lg font-semibold">
  <Package className="h-5 w-5 text-brand-rose/80" />
  {copy.ingredientManager.title}
</h2>
        </div>
        <div className="text-xs text-slate-500 text-left sm:text-right">
          {copy.ingredientManager.helper}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-5">
        <InputField label={copy.ingredientManager.name} value={name} onChange={setName} placeholder={copy.ingredientManager.placeholder} className="sm:col-span-2" />
        <div className="space-y-1">
          <label className="text-xs font-semibold text-slate-600">{copy.ingredientManager.unit}</label>
          <select
            className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-800 shadow-sm focus:border-brand-rose focus:outline-none"
            value={unit}
            onChange={(event) => setUnit(event.target.value as UnitType)}
          >
            {unitOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>
        <InputField
          label={copy.ingredientManager.packageSize}
          value={packageSize}
          onChange={setPackageSize}
          inputMode="decimal"
          suffix={unit}
        />
        <InputField label={copy.ingredientManager.packageCost} value={packageCost} onChange={setPackageCost} inputMode="decimal" prefix="$" />
        <div className="flex items-end">
          <button
            type="button"
            onClick={handleAdd}
            disabled={!canSave}
            className="w-full rounded-xl bg-brand-slate px-4 py-2 text-sm font-semibold text-white shadow-card transition hover:-translate-y-0.5 hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-50"
          >
            {copy.ingredientManager.addButton}
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-200 text-sm">
          <thead className="bg-slate-50 text-left text-xs uppercase tracking-wide text-slate-500">
            <tr>
              <th className="px-3 py-2 font-semibold">{copy.ingredientManager.name}</th>
              <th className="px-3 py-2 font-semibold">{copy.ingredientManager.unit}</th>
              <th className="px-3 py-2 font-semibold">{copy.ingredientManager.packageSize}</th>
              <th className="px-3 py-2 font-semibold">{copy.ingredientManager.packageCost}</th>
              <th className="px-3 py-2 font-semibold">{copy.ingredientManager.costPerUnit}</th>
              <th className="px-3 py-2 font-semibold text-right">{copy.ingredientManager.actions}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {ingredients.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-3 py-4 text-center text-slate-500">
                  {copy.ingredientManager.empty}
                </td>
              </tr>
            ) : (
              ingredients.map((ingredient) => (
                <tr key={ingredient.id} className="hover:bg-slate-50">
                  <td className="px-3 py-2 font-semibold text-slate-800">
                    <input
                      className="w-full rounded-lg border border-slate-200 bg-white px-2 py-1 text-sm font-semibold text-slate-800 shadow-inner focus:border-brand-rose focus:outline-none"
                      value={ingredient.name}
                      onChange={(event) => onUpdate(ingredient.id, { name: event.target.value })}
                    />
                  </td>
                  <td className="px-3 py-2 text-slate-600">
                    <select
                      className="w-full rounded-lg border border-slate-200 bg-white px-2 py-1 text-sm font-semibold text-slate-800 shadow-inner focus:border-brand-rose focus:outline-none"
                      value={ingredient.unit}
                      onChange={(event) => onUpdate(ingredient.id, { unit: event.target.value as UnitType })}
                    >
                      {unitOptions.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="px-3 py-2 text-slate-600">
                    <input
                      className="w-full rounded-lg border border-slate-200 bg-white px-2 py-1 text-sm font-semibold text-slate-800 shadow-inner focus:border-brand-rose focus:outline-none"
                      type="number"
                      min="0"
                      step="0.01"
                      value={ingredient.packageSize}
                      onChange={(event) => onUpdate(ingredient.id, { packageSize: Number(event.target.value) })}
                    />
                  </td>
                  <td className="px-3 py-2 text-slate-600">
                    <input
                      className="w-full rounded-lg border border-slate-200 bg-white px-2 py-1 text-sm font-semibold text-slate-800 shadow-inner focus:border-brand-rose focus:outline-none"
                      type="number"
                      min="0"
                      step="0.01"
                      value={ingredient.packageCost}
                      onChange={(event) => onUpdate(ingredient.id, { packageCost: Number(event.target.value) })}
                    />
                  </td>
                  <td className="px-3 py-2 font-semibold text-brand-slate">
                    ${ingredient.costPerUnit.toFixed(4)} / {ingredient.unit}
                  </td>
                  <td className="px-3 py-2 text-right">
                    <button
                      type="button"
                      onClick={() => onDelete(ingredient.id)}
                      className="text-xs font-semibold text-brand-rose underline decoration-brand-rose/40 decoration-2 underline-offset-4"
                    >
                      {copy.ingredientManager.delete}
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function InputField({
  label,
  value,
  onChange,
  placeholder,
  inputMode,
  prefix,
  suffix,
  className,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  inputMode?: "decimal";
  prefix?: string;
  suffix?: string;
  className?: string;
}) {
  return (
    <label className={`space-y-1 text-xs font-semibold text-slate-600 ${className ?? ""}`}>
      <span>{label}</span>
      <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 shadow-sm focus-within:border-brand-rose focus-within:ring-2 focus-within:ring-brand-rose/40">
        {prefix ? <span className="text-slate-400">{prefix}</span> : null}
        <input
          className="w-full border-none bg-transparent text-sm font-semibold text-slate-800 focus:outline-none"
          type="text"
          inputMode={inputMode}
          value={value}
          placeholder={placeholder}
          onChange={(event) => onChange(event.target.value)}
        />
        {suffix ? <span className="text-slate-400">{suffix}</span> : null}
      </div>
    </label>
  );
}
