"use client";

import { useEffect } from "react";

export function ProActivation() {
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);

    if (params.get("pro") === "success") {
      localStorage.setItem("isPro", "true");

      // Limpia la URL
      window.history.replaceState({}, "", window.location.pathname);
    }
  }, []);

  return null;
}
