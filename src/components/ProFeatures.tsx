"use client";

export function ProFeatures() {
  return (
    <div className="rounded-2xl border border-dashed border-slate-200 bg-white p-4 shadow-card sm:p-6">
      <div className="flex items-center gap-2">
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 text-lg">🔒</div>
        <div>
          <p className="text-sm font-bold text-brand-slate">PRO features — coming soon</p>
          <p className="text-xs text-slate-500">Preview only. These costs are not part of the current calculator yet.</p>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
        <LockedTile
          title="Electricity / oven energy cost"
          description="Bake time × oven power × cost per kWh. Track utilities alongside ingredients and labor."
        />
        <LockedTile
          title="Monthly operational expenses"
          description="Spread rent, utilities, marketing, internet/phone, and accounting across orders."
        />
        <LockedTile
          title="Save presets and reports"
          description="Store go-to recipes, export quotes, and run profitability snapshots."
        />
        <LockedTile
          title="Advanced fee rules"
          description="Rush fees, delivery distance bands, and seasonal surcharges without editing formulas."
        />
      </div>
    </div>
  );
}

function LockedTile({ title, description }: { title: string; description: string }) {
  return (
    <div className="flex h-full flex-col gap-2 rounded-xl border border-slate-100 bg-slate-50 p-3">
      <div className="flex items-center justify_between gap-2">
        <p className="text-sm font-semibold text-brand-slate">{title}</p>
        <span className="rounded-full bg-slate-200 px-2 py-1 text-[11px] font-bold uppercase tracking-wide text-slate-600">
          PRO
        </span>
      </div>
      <p className="text-xs text-slate-600">{description}</p>
      <div className="mt-auto flex items-center gap-2 rounded-lg border border-dashed border-slate-300 bg-white px-3 py-2 text-[11px] font-semibold text-slate-500">
        <span>🔒</span>
        <span>Locked — not part of today&apos;s calculation</span>
      </div>
    </div>
  );
}
