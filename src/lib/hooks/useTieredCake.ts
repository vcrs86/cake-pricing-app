import { useMemo, useState } from "react";
import type { Tier } from "@/lib/types/Tier";

export function useTieredCake() {
  const [isTieredCake, setIsTieredCake] = useState(false);
  const [tiers, setTiers] = useState<Tier[]>([]);

  const totalServings = useMemo(
    () => tiers.reduce((sum, tier) => sum + (tier.servings || 0), 0),
    [tiers],
  );

  return {
    isTieredCake,
    setIsTieredCake,
    tiers,
    setTiers,
    totalServings,
  };
}
