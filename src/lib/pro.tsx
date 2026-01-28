"use client";

import { createContext, useContext, useEffect, useState } from "react";

type ProContextValue = {
  isPro: boolean;
  activatePro: () => void;
  isReady: boolean;
};

const ProContext = createContext<ProContextValue | undefined>(undefined);
const PRO_KEY = "cakeprice_pro";

export function ProProvider({ children }: { children: React.ReactNode }) {
  const [isPro, setIsPro] = useState(false);
  const [isReady, setIsReady] = useState(false);

  // 🔒 ÚNICA lectura inicial (blindada)
  useEffect(() => {
    const stored = localStorage.getItem(PRO_KEY);
    const proFromStorage = stored === "true";

    // FORZAR fuente de verdad
    setIsPro(proFromStorage);
    setIsReady(true);

    // 🔑 Sincronizar estado viejo (solo si existe)
    const legacy = localStorage.getItem("cakeAppProState");
    if (legacy) {
      try {
        const parsed = JSON.parse(legacy);
        if (parsed.isPro !== proFromStorage) {
          localStorage.setItem(
            "cakeAppProState",
            JSON.stringify({ ...parsed, isPro: proFromStorage })
          );
        }
      } catch {}
    }
  }, []);

  const activatePro = () => {
    localStorage.setItem(PRO_KEY, "true");
    setIsPro(true);

    // mantener sincronizado el estado viejo
    const legacy = localStorage.getItem("cakeAppProState");
    if (legacy) {
      try {
        const parsed = JSON.parse(legacy);
        localStorage.setItem(
          "cakeAppProState",
          JSON.stringify({ ...parsed, isPro: true })
        );
      } catch {}
    }
  };

  return (
    <ProContext.Provider value={{ isPro, activatePro, isReady }}>
      {children}
    </ProContext.Provider>
  );
}

export function usePro() {
  const ctx = useContext(ProContext);
  if (!ctx) {
    throw new Error("usePro must be used within ProProvider");
  }
  return ctx;
}
