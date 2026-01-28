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
      <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-brand-rose/20">
        <Sparkles className="h-8 w-8 text-brand-rose" />
      </div>

      <h1 className="text-2xl font-black text-brand-slate">
        {copy?.success?.title || "¡PRO activado!"}
      </h1>

      <p className="mt-3 text-sm text-slate-600">
        {copy?.success?.description ||
          "Tu compra se procesó correctamente y la versión PRO ya está activa en este dispositivo."}
      </p>

      <button
        onClick={() => router.push("/")}
        className="mt-6 rounded-xl bg-brand-rose px-5 py-2 text-sm font-semibold text-white shadow hover:opacity-90"
      >
        {copy?.success?.backButton || "Volver a la app"}
      </button>

      <p className="mt-4 text-[11px] text-slate-400 italic">
        {copy?.success?.note ||
          "El acceso PRO se guarda en este navegador. No borres los datos para conservarlo."}
      </p>
    </main>
  );
}
