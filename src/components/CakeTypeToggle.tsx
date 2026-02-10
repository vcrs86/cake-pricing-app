import { useLanguage } from "@/lib/i18n";

type CakeTypeToggleProps = {
  value: "single" | "tiered";
  onChange: (value: "single" | "tiered") => void;
  tieredLocked?: boolean;
};

export function CakeTypeToggle({ value, onChange, tieredLocked }: CakeTypeToggleProps) {
  const { copy } = useLanguage();

  return (
    <div className="space-y-2">
      <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
        {copy.calculator?.cakeTypeLabel ?? "Cake type"}
      </p>
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => onChange("single")}
          className={`rounded-full px-4 py-2 text-xs font-semibold transition ${
            value === "single"
              ? "bg-brand-slate text-white shadow"
              : "border border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
          }`}
        >
          {copy.calculator?.singleLayerLabel ?? "Single layer"}
        </button>
        <button
          type="button"
          disabled={tieredLocked}
          onClick={() => onChange("tiered")}
          className={`rounded-full px-4 py-2 text-xs font-semibold transition ${
            value === "tiered"
              ? "bg-brand-rose text-brand-slate shadow"
              : "border border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
          } ${tieredLocked ? "cursor-not-allowed opacity-50" : ""}`}
        >
          {copy.calculator?.tieredLabel ?? "Tiered cake"}
        </button>
      </div>
      {tieredLocked ? (
        <p className="text-xs text-slate-500">
          {copy.pro?.locked ?? "PRO only"}
        </p>
      ) : null}
    </div>
  );
}
