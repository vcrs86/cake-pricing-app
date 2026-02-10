"use client";

import React from "react";
import { useLanguage } from "@/lib/i18n";
import type { CakeLevel, CakeLevelSize } from "@/lib/types/cakeLevel";

type Props = {
  levels: CakeLevel[];
  setLevels: React.Dispatch<React.SetStateAction<CakeLevel[]>>;
};

type DimensionSize = Extract<CakeLevelSize, { type: "dimensions" }>;
type SafeCakeLevel = CakeLevel & { size: CakeLevelSize };

const isDimensionsSize = (size: CakeLevelSize): size is DimensionSize =>
  size.type === "dimensions";

export function CakeLevels({ levels, setLevels }: Props) {
  const { copy } = useLanguage();

  const t = copy.pro?.cakeLevels ?? copy.landing?.comparison?.pro?.cakeLevels ?? {
    title: "Cake Levels",
    helper: "Configure each tier of your cake",
    numberOfTiers: "Number of tiers",
    tier: "Tier",
    flavor: "Flavor",
    shape: "Shape",
    shapeRound: "Round",
    shapeSquare: "Square",
    shapeRectangular: "Rectangular",
    size: "Size",
    diameter: "Diameter",
    sideLength: "Side length",
    width: "Width",
    height: "Height",
    unitInches: "in",
    servingsLabel: "Servings",
    complexity: "Complexity",
  };

  /* =====================
     LEVEL COUNT
  ===================== */
  const setTierCount = (count: number) => {
    setLevels((prev) => {
      const next = [...prev];

      while (next.length < count) {
        next.push({
          id: crypto.randomUUID(),
          flavor: "",
          shape: "round",
          size: { type: "diameter", value: undefined },
          servings: undefined,
          complexity: "basic",
        });
      }

      return next.slice(0, count);
    });
  };

  /* =====================
     UPDATE HELPERS
  ===================== */
  const updateFlavor = (index: number, flavor: string) => {
    setLevels((prev) => prev.map((lvl, i) => (i === index ? { ...lvl, flavor } : lvl)));
  };

  const updateShape = (index: number, shape: CakeLevel["shape"]) => {
    setLevels((prev) =>
      prev.map((lvl, i) => {
        if (i !== index) return lvl;

        if (shape === "round") {
          return {
            ...lvl,
            shape: "round",
            size: { type: "diameter", value: undefined },
            servings: lvl.servings,
          };
        }

        if (shape === "square") {
          return {
            ...lvl,
            shape: "square",
            size: { type: "side", value: undefined },
            servings: lvl.servings,
          };
        }

          return {
            ...lvl,
            shape: "rectangular",
            size: { type: "dimensions", width: undefined, height: undefined },
            servings: lvl.servings,
          };
      })
    );
  };

  const updateSize = (index: number, size: CakeLevelSize) => {
    setLevels((prev) => prev.map((lvl, i) => (i === index ? { ...lvl, size } : lvl)));
  };

  const updateServings = (index: number, servings: number | undefined) => {
    setLevels((prev) => prev.map((lvl, i) => (i === index ? { ...lvl, servings } : lvl)));
  };

  const getSafeLevel = (level: CakeLevel): SafeCakeLevel => ({
    ...level,
    size:
      level.size ??
      (typeof level.diameter === "number"
        ? { type: "diameter", value: level.diameter }
        : { type: "diameter", value: undefined }),
  });

  /* =====================
     RENDER
  ===================== */
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm space-y-4">
      <div>
        <h3 className="text-lg font-bold text-brand-slate">🎂 {t.title}</h3>
        <p className="text-xs text-slate-500">{t.helper}</p>
      </div>

      {/* Number of tiers */}
      <div className="flex items-center gap-3">
        <label className="text-xs font-semibold text-slate-600">{t.numberOfTiers}</label>
        <select
          value={levels.length}
          onChange={(event) => setTierCount(Number(event.target.value))}
          className="w-20 rounded-md border px-2 py-1 text-xs"
        >
          {[1, 2, 3, 4].map((n) => (
            <option key={n} value={n}>
              {n}
            </option>
          ))}
        </select>
      </div>

      {/* Levels */}
      {levels.map((level, index) => {
        const safeLevel = getSafeLevel(level);
        const safeSize = safeLevel.size;

        return (
        <div key={level.id} className="rounded-xl border bg-slate-50 p-3 space-y-3">
          <h4 className="text-xs font-semibold text-brand-slate">
            {t.tier} {index + 1}
          </h4>

          <div className="grid gap-3 sm:grid-cols-4">
            {/* Flavor */}
            <label className="space-y-1 text-[11px] font-semibold text-slate-600">
              <span>{t.flavor}</span>
              <input
                value={safeLevel.flavor}
                onChange={(event) => updateFlavor(index, event.target.value)}
                placeholder={t.flavor}
                className="w-full rounded-md border px-2 py-1.5 text-xs"
              />
            </label>

            {/* Shape */}
            <label className="space-y-1 text-[11px] font-semibold text-slate-600">
              <span>{t.shape}</span>
              <select
                value={safeLevel.shape}
                onChange={(event) => updateShape(index, event.target.value as CakeLevel["shape"])}
                className="w-full rounded-md border px-2 py-1.5 text-xs"
              >
                <option value="round">{t.shapeRound}</option>
                <option value="square">{t.shapeSquare}</option>
                <option value="rectangular">{t.shapeRectangular}</option>
              </select>
            </label>

            {/* Size */}
            <div className="space-y-1 text-[11px] font-semibold text-slate-600">
              <span>{t.size}</span>
              {safeSize.type === "diameter" && (
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    value={safeSize.value ?? ""}
                    onChange={(event) =>
                      updateSize(index, {
                        type: "diameter",
                        value: event.target.value === "" ? undefined : Number(event.target.value),
                      })
                    }
                    placeholder={t.diameter}
                    className="w-full rounded-md border px-2 py-1.5 text-xs"
                  />
                  <span className="text-xs text-slate-500">{t.unitInches}</span>
                </div>
              )}

              {safeSize.type === "side" && (
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    value={safeSize.value ?? ""}
                    onChange={(event) =>
                      updateSize(index, {
                        type: "side",
                        value: event.target.value === "" ? undefined : Number(event.target.value),
                      })
                    }
                    placeholder={t.sideLength}
                    className="w-full rounded-md border px-2 py-1.5 text-xs"
                  />
                  <span className="text-xs text-slate-500">{t.unitInches}</span>
                </div>
              )}

              {isDimensionsSize(safeSize) && (
                <div className="flex gap-2">
                  <div className="flex w-1/2 items-center gap-2">
                    <input
                      type="number"
                      value={safeSize.width ?? ""}
                      onChange={(event) =>
                        updateSize(index, {
                          type: "dimensions",
                          width: event.target.value === "" ? undefined : Number(event.target.value),
                          height: safeSize.height,
                        })
                      }
                      placeholder={t.width}
                      className="w-full rounded-md border px-2 py-1.5 text-xs"
                    />
                    <span className="text-xs text-slate-500">{t.unitInches}</span>
                  </div>
                  <div className="flex w-1/2 items-center gap-2">
                    <input
                      type="number"
                      value={safeSize.height ?? ""}
                      onChange={(event) =>
                        updateSize(index, {
                          type: "dimensions",
                          width: safeSize.width,
                          height: event.target.value === "" ? undefined : Number(event.target.value),
                        })
                      }
                      placeholder={t.height}
                      className="w-full rounded-md border px-2 py-1.5 text-xs"
                    />
                    <span className="text-xs text-slate-500">{t.unitInches}</span>
                  </div>
                </div>
              )}
            </div>

            {/* Servings */}
            <label className="space-y-1 text-[11px] font-semibold text-slate-600">
              <span>{t.servingsLabel}</span>
              <input
                type="number"
                value={safeLevel.servings ?? ""}
                onChange={(event) =>
                  updateServings(
                    index,
                    event.target.value === "" ? undefined : Number(event.target.value),
                  )
                }
                placeholder={t.servingsLabel}
                className="w-full rounded-md border px-2 py-1.5 text-xs"
              />
            </label>
          </div>
        </div>
        );
      })}
    </section>
  );
}
