"use client";

import { createContext, useContext, useEffect, useState } from "react";

type ProContextValue = {
  isPro: boolean;
  activatePro: (token: string) => void;
  isReady: boolean;
};

const ProContext = createContext<ProContextValue | undefined>(undefined);

const PRO_TOKEN_KEY = "cakeprice_pro_token";

export function ProProvider({ children }: { children: React.ReactNode }) {
  const [isPro, setIsPro] = useState(false);
  const [isReady, setIsReady] = useState(false);

  // 🔍 Validar PRO desde servidor
  useEffect(() => {
    const token = localStorage.getItem(PRO_TOKEN_KEY);

    if (!token) {
      setIsReady(true);
      return;
    }

    fetch(`/api/validate-pro?token=${token}`)
      .then((r) => r.json())
      .then((data) => {
        setIsPro(data.valid);
        setIsReady(true);
      })
      .catch(() => {
        setIsReady(true);
      });
  }, []);

  // 🔑 Activar PRO con token real
  const activatePro = (token: string) => {
    localStorage.setItem(PRO_TOKEN_KEY, token);
    setIsPro(true);
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
