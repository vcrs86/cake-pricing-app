"use client";

import { type Ingredient, type RecipeLineCost, type UnitType } from "@/lib/ingredients";
import { useMemo, useState } from "react";
import { useLanguage } from "@/lib/i18n";
import { ListChecks } from "lucide-react";

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
  ingredients = [],
  lines = [],
  onAddLine,
  onChangeLine,
  onRemoveLine,
  lineCosts = [],
  totalCost,
}: RecipeBuilderProps) {
  const { copy } = useLanguage();
  const [searchTerm, setSearchTerm] = useState("");
const [openId, setOpenId] = useState<string | null>(null);

const filteredIngredients = useMemo(() => {
  return ingredients.filter((i) =>
    i.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
}, [ingredients, searchTerm]);

 
  // Memorizamos la lista para búsqueda rápida
  const ingredientLookup = useMemo(() => 
    new Map(ingredients.map((i) => [i.id, i])), 
  [ingredients]);

  return (
    <div className="space-y-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-card sm:p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-wide text-slate-500">{copy.recipeBuilder.badge}</p>
          <h2 className="flex items-center gap-2 text-lg font-semibold">
            <ListChecks className="h-5 w-5 text-brand-rose/80" />
            {copy.recipeBuilder.title}
          </h2>
        </div>
        <button
          type="button"
          onClick={onAddLine}
          className="rounded-full bg-brand-rose/15 px-3 py-1 text-xs font-semibold text-brand-slate shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg"
        >
          {copy.recipeBuilder.addLine}
        </button>
      </div>

      {lines.length === 0 ? (
        <p className="rounded-xl bg-slate-50 px-4 py-3 text-sm text-slate-600">
          {copy.recipeBuilder.empty}
        </p>
      ) : (
        <div className="space-y-2">
          {lines.map((line) => {
            const ingredient = ingredientLookup.get(line.ingredientId);
            
            return (
              <div
                key={line.id}
                className="grid grid-cols-1 gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 shadow-sm sm:grid-cols-12 sm:items-center"
              >
                <div className="sm:col-span-4 relative">
  <label className="space-y-1 text-xs font-semibold text-slate-600">
    <span>{copy.recipeBuilder.ingredient}</span>

    <input
      type="text"
      placeholder="Search ingredient..."
      value={
        ingredient
          ? ingredient.name
          : ""
      }
      onChange={(e) => {
        onChangeLine(line.id, {
          ingredientId: "",
        });

        setSearchTerm(e.target.value);
        setOpenId(line.id);
      }}
      onFocus={() => setOpenId(line.id)}
      className="w-full rounded-lg border border-slate-200 bg-white px-2 py-1.5 text-sm font-semibold text-slate-800 shadow-sm focus:border-brand-rose focus:outline-none"
    />
  </label>

  {openId === line.id && (
    <div className="absolute z-20 mt-1 max-h-40 w-full overflow-auto rounded-lg border border-slate-200 bg-white shadow-lg">
      {filteredIngredients.map((opt) => (
        <button
          key={opt.id}
          type="button"
          onClick={() => {
            onChangeLine(line.id, {
              ingredientId: opt.id,
            });

            setOpenId(null);
          }}
          className="block w-full px-3 py-2 text-left text-sm hover:bg-brand-rose/10"
        >
          {opt.name}
        </button>
      ))}

      {filteredIngredients.length === 0 && (
        <div className="px-3 py-2 text-xs text-slate-400">
          No results
        </div>
      )}
    </div>
  )}
</div>


                {/* ENTRADA DE CANTIDAD */}
                <div className="sm:col-span-3">
                  <NumberInput
                    label={copy.recipeBuilder.quantity}
                    value={line.quantity}
                    onChange={(value) => onChangeLine(line.id, { quantity: value })}
                    suffix={ingredient ? unitLabel(ingredient.unit) : undefined}
                  />
                </div>

                {/* COSTO DE LA LÍNEA (CÁLCULO EN VIVO) */}
                <div className="sm:col-span-3">
                  <div className="space-y-1 text-xs font-semibold text-slate-600">
                    <span>{copy.recipeBuilder.lineCost}</span>
                    <div className="rounded-lg border border-dashed border-slate-200 bg-slate-50 px-3 py-2 text-sm font-bold text-brand-slate">
                      {(() => {
                        if (!ingredient || !line.quantity) return "$0.00";

                        // Detectamos automáticamente si los campos se llaman price o packageCost
                        const qty = Number(line.quantity) || 0;
const price = Number(ingredient.packageCost || 0);
const size = Number(ingredient.packageSize || 1);

const total = (qty / size) * price;

                        return `$${total.toFixed(2)}`;
                      })()}
                    </div>
                  </div>
                </div>

                {/* BOTÓN QUITAR */}
                <div className="sm:col-span-2 flex items-end justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => onRemoveLine(line.id)}
                    className="text-sm font-semibold text-brand-rose underline decoration-brand-rose/40 decoration-2 underline-offset-4"
                  >
                    {copy.recipeBuilder.remove}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* TOTAL GENERAL */}
      <div className="flex items-center justify-between rounded-xl bg-slate-50 px-4 py-3 text-sm font-semibold text-brand-slate border-t border-slate-100">
        <span>{copy.recipeBuilder.total}</span>
        <span className="text-lg font-black">
          ${(Number(totalCost) || 0).toFixed(2)}
        </span>
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
    <div className="space-y-1 text-xs font-semibold text-slate-600">
      <span>{label}</span>
      <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 shadow-sm focus-within:border-brand-rose focus-within:ring-2 focus-within:ring-brand-rose/40">
        <input
          className="w-full border-none bg-transparent text-sm font-semibold text-slate-800 focus:outline-none"
          type="text"
          inputMode="decimal"
          value={value || ""}
          onChange={(event) => {
            // Permitimos solo números y un punto decimal
            const val = event.target.value.replace(/[^0-9.]/g, '');
            onChange(val);
          }}
        />
        {suffix ? <span className="text-slate-400">{suffix}</span> : null}
      </div>
    </div>
  );
}

function unitLabel(unit: UnitType) {
  return unit;
}
