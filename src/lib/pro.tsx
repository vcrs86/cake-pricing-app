"use client";

import { createContext, useContext, useEffect, useState } from "react";

type ProContextValue = {
  isPro: boolean;
  activatePro: () => void;
};

const ProContext = createContext<ProContextValue | undefined>(undefined);

export function ProProvider({ children }: { children: React.ReactNode }) {
  const [isPro, setIsPro] = useState(false);

  // 🔒 Cargar estado desde localStorage
  useEffect(() => {
    const stored = localStorage.getItem("cakeprice_pro");
    if (stored === "true") {
      setIsPro(true);
    }
  }, []);

  // ✅ Activar PRO (temporal, luego Stripe)
  const activatePro = () => {
    setIsPro(true);
    localStorage.setItem("cakeprice_pro", "true");
  };

  return (
    <ProContext.Provider value={{ isPro, activatePro }}>
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
