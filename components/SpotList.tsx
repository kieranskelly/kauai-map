"use client";

import { POIS, CATEGORIES, CATEGORY_KEYS } from "@/lib/pois";
import { useMapStore } from "@/lib/store";

// Left-side list overlay. Appears once one or more category filters are active
// (additive selection) and lists the spots in those categories, grouped by
// category. Each row selects the spot (fly-to + card). Hidden when no filter is
// active — which is also when the map shows every pin.
export function SpotList() {
  const selectedCats = useMapStore((s) => s.selectedCats);
  const selectedId = useMapStore((s) => s.selectedId);
  const select = useMapStore((s) => s.select);
  const clear = useMapStore((s) => s.clearCategories);

  if (selectedCats.length === 0) return null;

  // Canonical category order, only the selected ones, spots A–Z within each.
  const sections = CATEGORY_KEYS.filter((k) => selectedCats.includes(k)).map(
    (k) => ({
      key: k,
      cat: CATEGORIES[k],
      spots: POIS.filter((p) => p.category === k).sort((a, b) =>
        a.name.localeCompare(b.name),
      ),
    }),
  );
  const total = sections.reduce((n, s) => n + s.spots.length, 0);

  return (
    <div className="pointer-events-auto flex w-60 max-w-[72vw] flex-col overflow-hidden rounded-2xl border border-white/10 bg-[#0b1d2a]/85 shadow-2xl backdrop-blur-xl">
      <div className="flex items-center justify-between px-3 py-2">
        <span className="text-[11px] font-semibold uppercase tracking-wide text-white/50">
          {total} {total === 1 ? "spot" : "spots"}
        </span>
        <button
          onClick={clear}
          className="text-[11px] text-white/45 transition hover:text-white/80"
        >
          Clear
        </button>
      </div>

      <div className="max-h-[56dvh] overflow-y-auto px-1.5 pb-2">
        {sections.map(({ key, cat, spots }) => (
          <div key={key} className="mb-1">
            <div className="flex items-center gap-1.5 px-2 py-1 text-[11px] font-semibold text-white/70">
              <span aria-hidden>{cat.emoji}</span>
              {cat.label}
              <span className="text-white/35">{spots.length}</span>
            </div>
            <ul>
              {spots.map((poi) => {
                const on = poi.id === selectedId;
                return (
                  <li key={poi.id}>
                    <button
                      onClick={() => select(poi.id)}
                      className={`flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-left text-sm transition ${
                        on ? "bg-white/15" : "hover:bg-white/10"
                      }`}
                    >
                      <span
                        className="h-2 w-2 shrink-0 rounded-full"
                        style={{ backgroundColor: cat.color }}
                      />
                      <span className="min-w-0 flex-1 truncate text-white/90">
                        {poi.name}
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
