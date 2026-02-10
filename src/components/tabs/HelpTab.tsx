"use client";

import { useLanguage } from "@/lib/i18n";

type HelpTabProps = {
  isPro: boolean;
};

function Badge({
  variant,
  children,
}: {
  variant: "free" | "pro" | "both";
  children: React.ReactNode;
}) {
  const base =
    "inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide ring-1";
  const styles =
    variant === "pro"
      ? "bg-brand-rose/15 text-brand-slate ring-brand-rose/25"
      : variant === "free"
        ? "bg-slate-100 text-slate-600 ring-slate-200"
        : "bg-white/70 text-slate-700 ring-slate-200";

  const icon = variant === "pro" ? "🔒" : variant === "free" ? "🆓" : "✅";

  return (
    <span className={`${base} ${styles}`}>
      <span className="mr-1">{icon}</span>
      {children}
    </span>
  );
}

function Card({
  title,
  subtitle,
  badge,
  children,
}: {
  title: string;
  subtitle?: string;
  badge?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white/80 p-5 shadow-card backdrop-blur">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="text-base font-extrabold text-brand-slate">{title}</h3>
          {subtitle ? (
            <p className="mt-1 text-sm text-slate-600">{subtitle}</p>
          ) : null}
        </div>
        {badge ? <div className="shrink-0">{badge}</div> : null}
      </div>

      <div className="mt-4 space-y-3 text-sm text-slate-700">{children}</div>
    </div>
  );
}

function BulletList({ items }: { items: string[] }) {
  return (
    <ul className="space-y-2">
      {items.map((t, i) => (
        <li key={i} className="flex gap-2">
          <span className="mt-0.5 text-slate-400">•</span>
          <span className="leading-relaxed">{t}</span>
        </li>
      ))}
    </ul>
  );
}

export function HelpTab({ isPro }: HelpTabProps) {
  const { copy, language } = useLanguage();

  // ✅ Fallbacks para NO romper nada aunque falten keys en i18n
  const t = {
    title:
      copy?.help?.guide?.title ??
      (language === "es" ? "Guía de uso" : "How to use CakePrice"),
    subtitle:
      copy?.help?.guide?.subtitle ??
      (language === "es"
        ? "Un manual claro para evitar confusiones (FREE + PRO)."
        : "A clear guide to avoid confusion (FREE + PRO)."),
    note:
      copy?.help?.guide?.note ??
      (language === "es"
        ? "Tip: verás etiquetas 🆓 / ✅ / 🔒 PRO para saber qué está disponible."
        : "Tip: You’ll see 🆓 / ✅ / 🔒 PRO labels to know what’s available."),
  };

  const es = language === "es";

  return (
    <section className="space-y-5 animate-in fade-in slide-in-from-bottom-2 duration-300">
      {/* Header bonito */}
      <div className="relative overflow-hidden rounded-3xl border border-slate-200 bg-white/70 p-6 shadow-card backdrop-blur">
        <div className="pointer-events-none absolute -top-24 -right-24 h-72 w-72 rounded-full bg-brand-rose/20 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-brand-peach/30 blur-3xl" />

        <div className="relative z-10">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xl">❓</span>
            <h2 className="text-2xl font-black text-brand-slate">{t.title}</h2>
          </div>
          <p className="mt-2 max-w-3xl text-sm text-slate-600">{t.subtitle}</p>

          <div className="mt-4 flex flex-wrap gap-2">
            <Badge variant="free">{es ? "FREE" : "FREE"}</Badge>
            <Badge variant="both">{es ? "Ambas" : "Both"}</Badge>
            <Badge variant="pro">{es ? "PRO" : "PRO"}</Badge>
          </div>

          <p className="mt-3 text-xs text-slate-500">{t.note}</p>
        </div>
      </div>

      {/* 1) Modos */}
      <Card
        title={es ? "1) Modos de cálculo" : "1) Calculation modes"}
        subtitle={
          es
            ? "Elige Básico para rapidez y Avanzado para precisión."
            : "Choose Basic for speed and Advanced for accuracy."
        }
        badge={<Badge variant="both">{es ? "Disponible" : "Available"}</Badge>}
      >
        <BulletList
          items={[
            es
              ? "🆓 Básico: ingresas un total rápido de ingredientes (estimación)."
              : "🆓 Basic: enter a quick total ingredient cost (estimate).",
            es
              ? "✅ Avanzado: recetas + costos detallados para mayor precisión."
              : "✅ Advanced: recipes + detailed inputs for better accuracy.",
          ]}
        />

        <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-4">
          <p className="text-sm font-semibold text-brand-slate">
            {es ? "Regla rápida" : "Quick rule"}
          </p>
          <p className="mt-1 text-sm text-slate-600">
            {es
              ? "Si el pastel es personalizado o caro, usa Avanzado."
              : "If the cake is custom or high-value, use Advanced."}
          </p>
        </div>
      </Card>

      {/* 2) Recipes */}
      <Card
        title={es ? "2) Recetas" : "2) Recipes"}
        subtitle={
          es
            ? "Una receta debe representar UN solo pastel (no producción)."
            : "A recipe should represent ONE single cake (not bulk baking)."
        }
        badge={<Badge variant="both">{es ? "FREE + PRO" : "FREE + PRO"}</Badge>}
      >
        <BulletList
          items={[
            es
              ? "✅ Una receta = un sabor + un tamaño base (ej: Vainilla 8”)."
              : "✅ One recipe = one flavor + one base size (e.g., Vanilla 8”).",
            es
              ? "❌ No uses recetas para 2+ pasteles o producción masiva."
              : "❌ Don’t create recipes for 2+ cakes or bulk production.",
            es
              ? "🔒 PRO: puedes guardar y reutilizar recetas."
              : "🔒 PRO: you can save and reuse recipes.",
          ]}
        />
      </Card>

      {/* 3) Tiered Cake */}
      <Card
        title={es ? "3) Tiered Cake (niveles)" : "3) Tiered Cake (tiers)"}
        subtitle={
          es
            ? "Para pasteles de varios niveles. Se recomienda con Avanzado."
            : "For multi-tier cakes. Recommended with Advanced mode."
        }
        badge={<Badge variant="pro">{es ? "PRO" : "PRO"}</Badge>}
      >
        <div className="rounded-2xl border border-brand-rose/30 bg-brand-rose/10 p-4">
          <p className="text-sm font-semibold text-brand-slate">
            {es ? "Evita confusiones" : "Avoid confusion"}
          </p>
          <p className="mt-1 text-sm text-slate-700">
            {es
              ? "Tiered Cake usa el costo total del pedido para distribuirlo por niveles. Si estás en Básico, asegúrate de haber ingresado un total realista."
              : "Tiered Cake uses the total order cost and distributes it across tiers. If you’re in Basic mode, make sure your quick total is realistic."}
          </p>
        </div>

        <BulletList
          items={[
            es
              ? "✅ Mejor práctica: usa Avanzado + recetas por sabor."
              : "✅ Best practice: use Advanced + recipes per flavor.",
            es
              ? "🧠 Consejo: cada nivel puede tener sabor y porciones distintas."
              : "🧠 Tip: each tier can have different flavor and servings.",
          ]}
        />
      </Card>

      {/* 4) Operational costs */}
      <Card
        title={es ? "4) Costos operativos" : "4) Operational costs"}
        subtitle={
          es
            ? "Energía, renta, utilities y marketing (para precios más reales)."
            : "Energy, rent, utilities, and marketing (more realistic pricing)."
        }
        badge={<Badge variant="pro">{es ? "PRO" : "PRO"}</Badge>}
      >
        <BulletList
          items={[
            es
              ? "🔒 PRO: estos costos se suman al precio final si los activas."
              : "🔒 PRO: these costs can be added to the final price if enabled.",
            es
              ? "🏠 Home baker: NO coloques la renta completa de tu casa. Usa un porcentaje."
              : "🏠 Home baker: do NOT enter your full home rent. Use a percentage.",
            es
              ? "💡 Utilities: están agrupados (no necesitas separarlos)."
              : "💡 Utilities: they’re grouped (you don’t need to split them).",
          ]}
        />
      </Card>

      {/* 5) Client view */}
      <Card
        title={es ? "5) Vista Cliente" : "5) Client view"}
        subtitle={
          es
            ? "Lista para compartir: muestra precio final y mensaje, sin revelar costos."
            : "Share-ready: shows final price and message without revealing costs."
        }
        badge={<Badge variant="both">{es ? "FREE + PRO" : "FREE + PRO"}</Badge>}
      >
        <BulletList
          items={[
            es
              ? "✅ Incluye foto opcional y mensaje para el cliente."
              : "✅ Includes optional photo and client message.",
            es
              ? "✅ Botones: imprimir / vista PDF."
              : "✅ Buttons: print / PDF view.",
            es
              ? isPro
                ? "🔒 PRO activo: puede mostrar tu logo y nombre si lo configuraste."
                : "🔒 PRO: puede mostrar tu logo y nombre si lo configuras."
              : isPro
                ? "🔒 PRO active: can show your logo and business name if configured."
                : "🔒 PRO: can show your logo and business name if configured.",
          ]}
        />
      </Card>

      {/* Footer callout */}
      <div className="rounded-3xl border border-slate-200 bg-white/70 p-5 text-sm text-slate-600 shadow-card backdrop-blur">
        <p className="font-semibold text-brand-slate">
          {es ? "¿Aún tienes dudas?" : "Still unsure?"}
        </p>
        <p className="mt-1">
          {es
            ? "Usa Avanzado para pedidos personalizados y Tiered Cake solo cuando el pastel tiene niveles."
            : "Use Advanced for custom orders and Tiered Cake only when the cake has tiers."}
        </p>
      </div>
    </section>
  );
}
