"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useLanguage } from "@/lib/i18n";

export default function SuccessPage() {
  const router = useRouter();
  const { copy } = useLanguage();

  useEffect(() => {
    // Activar PRO en este navegador
    localStorage.setItem("cakePricePro", "true");

    // Redirigir al home
    const timer = setTimeout(() => {
      router.push("/");
    }, 2000);

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-white px-6 text-center">
      <h1 className="text-2xl font-bold text-brand-slate">
        🎉 {copy.success.title}
      </h1>

      <p className="mt-3 text-sm text-slate-600">
        {copy.success.message}
      </p>

      <p className="mt-2 text-xs text-slate-400 italic">
        {copy.success.redirecting}
      </p>
    </main>
  );
}
