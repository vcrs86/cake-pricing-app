"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useLanguage } from "@/lib/i18n";
import { usePro } from "@/lib/pro";
import { Sparkles } from "lucide-react";

export default function SuccessPage() {
  const { copy } = useLanguage();
  const { activatePro, isPro } = usePro();
  const router = useRouter();

  // ✅ Activar PRO automáticamente al entrar a /success
  useEffect(() => {
    if (!isPro) {
      activatePro();
    }
  }, [isPro, activatePro]);

  return (
    <main className="mx-auto flex min-h-[70vh] max-w-md flex-col items-center justify-center px-6 text-center">
      <img
  src="/brand/logo-primary.png"
  alt="CakePrice"
  className="mb-4 h-14 w-auto"
/>
      <h1 className="text-2xl font-black text-brand-slate">
        {copy?.success?.title || "¡PRO activado!"}
      </h1>
<p className="mt-1 text-sm font-semibold text-brand-slate/80">
  {copy.success.subtitle}
</p>

      <p className="mt-3 text-sm text-slate-600">
        {copy?.success?.description ||
          "Tu compra se procesó correctamente y la versión PRO ya está activa en este dispositivo."}
      </p>
<ul className="mt-4 space-y-2 text-left text-sm text-slate-600">
  {copy.success.features.map((item: string) => (
    <li key={item} className="flex gap-2">
      <span>✔</span>
      <span>{item}</span>
    </li>
  ))}
</ul>
      <button
        onClick={() => router.push("/")}
        className="mt-6 rounded-xl bg-brand-rose px-5 py-2 text-sm font-semibold text-white shadow hover:opacity-90"
      >
        {copy?.success?.backButton || "Volver a la app"}
      </button>
      <p className="mt-6 text-xs text-slate-500">
  {copy.success.supportText}{" "}
  <a
    href="mailto:cakepriceapp@gmail.com"
    className="font-semibold text-brand-rose hover:underline"
  >
    cakepriceapp@gmail.com
  </a>
</p>
      <p className="mt-4 text-[11px] text-slate-400 italic">
        {copy?.success?.note ||
          "El acceso PRO se guarda en este navegador. No borres los datos para conservarlo."}
      </p>
    </main>
  );
}
