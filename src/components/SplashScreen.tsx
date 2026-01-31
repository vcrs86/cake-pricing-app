"use client";

import { useEffect, useState } from "react";

export function SplashScreen() {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
    }, 900); // ⏱️ duración del splash (ms)

    return () => clearTimeout(timer);
  }, []);

  if (!visible) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#CCB3C0]">
      <img
        src="/brand/logo-primary.png"
        alt="CakePrice"
        className="w-40 h-auto mb-4"
      />

      <p className="text-sm font-medium text-brand-slate opacity-80">
        Loading CakePrice…
      </p>
    </div>
  );
}
