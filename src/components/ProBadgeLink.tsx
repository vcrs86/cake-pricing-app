"use client";

import { useLanguage } from "@/lib/i18n";

type Props = {
  onClick?: () => void;
};

export function ProBadgeLink({ onClick }: Props) {
  const { copy } = useLanguage();

  return (
    <button
      type="button"
      onClick={onClick}
      className="
        inline-flex items-center gap-1
        rounded-full
        bg-brand-rose/15
        px-2 py-0.5
        text-[10px]
        font-semibold
        text-brand-slate
        hover:bg-brand-rose/25
        transition
      "
    >
      ✨ {copy.client.proBadge}
    </button>
  );
}
