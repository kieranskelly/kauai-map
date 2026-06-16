"use client";

import { CATEGORIES, CATEGORY_KEYS } from "@/lib/pois";
import { useMapStore } from "@/lib/store";

export function Filters() {
  const selectedCats = useMapStore((s) => s.selectedCats);
  const toggle = useMapStore((s) => s.toggleCategory);

  return (
    <div className="pointer-events-auto flex max-w-[calc(100vw-1rem)] gap-1.5 overflow-x-auto rounded-full bg-black/35 p-1.5 backdrop-blur-md [-ms-overflow-style:none] [scrollbar-width:none]">
      {CATEGORY_KEYS.map((k) => {
        const c = CATEGORIES[k];
        const on = selectedCats.includes(k);
        return (
          <button
            key={k}
            onClick={() => toggle(k)}
            aria-pressed={on}
            className={`flex shrink-0 items-center gap-1 rounded-full px-3 py-1.5 text-xs font-medium transition ${
              on ? "text-white shadow" : "text-white/45"
            }`}
            style={{ backgroundColor: on ? c.color : "rgba(255,255,255,0.06)" }}
          >
            <span aria-hidden>{c.emoji}</span>
            <span>{c.label}</span>
          </button>
        );
      })}
    </div>
  );
}
