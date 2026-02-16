"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useLanguage } from "@/lib/i18n";
import { usePro } from "@/lib/pro";

export default function SuccessClient() {
  const { copy } = useLanguage();
  const { activatePro, isPro } = usePro();
  const router = useRouter();
  const searchParams = useSearchParams();

  const token = searchParams.get("token");

  useEffect(() => {
  if (!token || isPro) return;

  const save = async () => {
    // Guardar cookie en servidor (iOS fix)
    await fetch("/api/set-pro-cookie", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ token }),
    });

    activatePro(token);
  };

  save();
}, [token, isPro, activatePro]);


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
          "Tu compra se procesó correctamente y tu acceso PRO está vinculado a tu compra."}
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
          "Tu acceso PRO está asociado a tu compra y puede usarse en varios dispositivos."}
      </p>
      {/* INSTALL APP TIP */}
<div className="mt-8 w-full rounded-2xl border border-brand-rose/20 bg-brand-rose/5 p-4 text-left text-sm text-slate-700">

  <h3 className="font-bold text-brand-slate mb-1">
    {copy.success.installTip.title}
  </h3>

  <p className="mb-3 text-xs text-slate-600">
    {copy.success.installTip.description}
  </p>

  {/* iOS */}
  <div className="mb-3">
    <p className="font-semibold text-xs mb-1">
      {copy.success.installTip.iosTitle}
    </p>

    <ul className="list-disc pl-5 space-y-0.5 text-xs">
      {copy.success.installTip.iosSteps.map((step: string) => (
        <li key={step}>{step}</li>
      ))}
    </ul>
  </div>

  {/* Android */}
  <div>
    <p className="font-semibold text-xs mb-1">
      {copy.success.installTip.androidTitle}
    </p>

    <ul className="list-disc pl-5 space-y-0.5 text-xs">
      {copy.success.installTip.androidSteps.map((step: string) => (
        <li key={step}>{step}</li>
      ))}
    </ul>
  </div>
</div>
    </main>
  );
}
