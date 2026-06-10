// Curated Kauaʻi points of interest. Coordinates are hand-placed and
// approximate — good enough to drop a pin on the right spot; tune freely.

export type CategoryKey =
  | "beach"
  | "hike"
  | "view"
  | "waterfall"
  | "sight"
  | "food"
  | "town";

export interface Category {
  label: string;
  emoji: string;
  color: string;
}

// Order here is the order the filter chips render in.
export const CATEGORIES: Record<CategoryKey, Category> = {
  beach: { label: "Beaches", emoji: "🏖️", color: "#06b6d4" },
  hike: { label: "Hikes", emoji: "🥾", color: "#f97316" },
  view: { label: "Views", emoji: "🌅", color: "#a855f7" },
  waterfall: { label: "Falls", emoji: "💧", color: "#3b82f6" },
  sight: { label: "Sights", emoji: "✨", color: "#ec4899" },
  food: { label: "Food", emoji: "🍽️", color: "#ef4444" },
  town: { label: "Towns", emoji: "🏘️", color: "#f59e0b" },
};

export const CATEGORY_KEYS = Object.keys(CATEGORIES) as CategoryKey[];

export type Region = "North" | "East" | "South" | "West";

export interface Poi {
  id: string;
  name: string;
  category: CategoryKey;
  region: Region;
  lat: number;
  lng: number;
  blurb: string;
}

export const POIS: Poi[] = [
  // ── North Shore ───────────────────────────────────────────────
  {
    id: "hanalei-bay",
    name: "Hanalei Bay",
    category: "beach",
    region: "North",
    lat: 22.2058,
    lng: -159.4997,
    blurb:
      "Two-mile crescent of golden sand framed by waterfall-laced mountains; the iconic pier sits at its east end.",
  },
  {
    id: "kee-beach",
    name: "Kēʻē Beach",
    category: "beach",
    region: "North",
    lat: 22.223,
    lng: -159.5825,
    blurb:
      "End-of-the-road reef lagoon and the gateway to the Nā Pali coast. State-park reservation required to enter.",
  },
  {
    id: "tunnels-beach",
    name: "Tunnels Beach (Makua)",
    category: "beach",
    region: "North",
    lat: 22.2228,
    lng: -159.5667,
    blurb:
      "Horseshoe reef with arguably the island's best snorkeling on calm summer days.",
  },
  {
    id: "kalalau-trail",
    name: "Kalalau Trail → Hanakāpīʻai",
    category: "hike",
    region: "North",
    lat: 22.2186,
    lng: -159.584,
    blurb:
      "The famous Nā Pali cliff trail. 2 miles to Hanakāpīʻai Beach, 4 more up-valley to a 300-ft waterfall.",
  },
  {
    id: "hanalei-valley-lookout",
    name: "Hanalei Valley Lookout",
    category: "view",
    region: "North",
    lat: 22.2061,
    lng: -159.4663,
    blurb:
      "Sweeping view over emerald taro fields and the Hanalei River — best in morning light.",
  },
  {
    id: "limahuli-garden",
    name: "Limahuli Garden",
    category: "sight",
    region: "North",
    lat: 22.2188,
    lng: -159.576,
    blurb:
      "Terraced botanical garden in a lush Nā Pali valley showcasing native and Polynesian plants.",
  },
  {
    id: "queens-bath",
    name: "Queen's Bath",
    category: "sight",
    region: "North",
    lat: 22.226,
    lng: -159.452,
    blurb:
      "Tide-pool grotto in the Princeville lava shelf — gorgeous, but only safe in low winter surf. ⚠️",
  },
  // ── East Side ─────────────────────────────────────────────────
  {
    id: "wailua-falls",
    name: "Wailua Falls",
    category: "waterfall",
    region: "East",
    lat: 22.0386,
    lng: -159.3786,
    blurb:
      "Double 80-ft waterfall right off the road — the one from the opening of Fantasy Island.",
  },
  {
    id: "opaekaa-falls",
    name: "ʻŌpaekaʻa Falls",
    category: "waterfall",
    region: "East",
    lat: 22.0546,
    lng: -159.3784,
    blurb: "A wide 150-ft falls with an easy, photogenic roadside lookout.",
  },
  {
    id: "sleeping-giant",
    name: "Sleeping Giant (Nounou)",
    category: "hike",
    region: "East",
    lat: 22.054,
    lng: -159.3565,
    blurb:
      "Ridge trail over the reclining-giant silhouette, with summit views across the east shore.",
  },
  {
    id: "hamura-saimin",
    name: "Hamura Saimin",
    category: "food",
    region: "East",
    lat: 21.9745,
    lng: -159.369,
    blurb:
      "Līhuʻe institution since 1952 — slurp saimin at the zigzag counter, save room for liliko'i pie.",
  },
  {
    id: "pono-market",
    name: "Pono Market",
    category: "food",
    region: "East",
    lat: 22.0817,
    lng: -159.319,
    blurb:
      "Kapaʻa local-style deli — poke, lau lau, and spam musubi done right. Grab-and-go done well.",
  },
  {
    id: "kapaa-path",
    name: "Ke Ala Hele Makalae",
    category: "town",
    region: "East",
    lat: 22.0866,
    lng: -159.338,
    blurb:
      "Breezy coastal walking & biking path threading Kapaʻa's beaches and laid-back town.",
  },
  // ── South Shore ───────────────────────────────────────────────
  {
    id: "poipu-beach",
    name: "Poʻipū Beach Park",
    category: "beach",
    region: "South",
    lat: 21.8743,
    lng: -159.4566,
    blurb:
      "Sunny south-shore beach with a protected keiki pool, snorkeling, and basking monk seals.",
  },
  {
    id: "spouting-horn",
    name: "Spouting Horn",
    category: "sight",
    region: "South",
    lat: 21.8806,
    lng: -159.4889,
    blurb:
      "Lava-tube blowhole that geysers seawater and moans with each incoming swell.",
  },
  {
    id: "mahaulepu",
    name: "Mahaʻulepu Heritage Trail",
    category: "hike",
    region: "South",
    lat: 21.88,
    lng: -159.425,
    blurb:
      "Wild, undeveloped coastal trail over sea cliffs, dunes, and sinkholes east of Shipwreck.",
  },
  {
    id: "shipwreck-beach",
    name: "Shipwreck Beach",
    category: "beach",
    region: "South",
    lat: 21.873,
    lng: -159.436,
    blurb:
      "Wide sandy beach below the Makawehi lithified cliffs — a local cliff-jump spot.",
  },
  {
    id: "tree-tunnel",
    name: "Tree Tunnel",
    category: "sight",
    region: "South",
    lat: 21.908,
    lng: -159.4635,
    blurb:
      "Mile-long canopy of eucalyptus arching over Maluhia Road as you enter Kōloa.",
  },
  {
    id: "old-koloa-town",
    name: "Old Kōloa Town",
    category: "town",
    region: "South",
    lat: 21.907,
    lng: -159.47,
    blurb:
      "Kauaʻi's first plantation town — historic storefronts, shave ice, and shops.",
  },
  {
    id: "beach-house",
    name: "The Beach House",
    category: "food",
    region: "South",
    lat: 21.8804,
    lng: -159.4836,
    blurb:
      "Oceanfront fine dining with the island's marquee sunset. Book well ahead.",
  },
  {
    id: "da-crack",
    name: "Da Crack",
    category: "food",
    region: "South",
    lat: 21.887,
    lng: -159.469,
    blurb:
      "Hole-in-the-wall Mexican near Poʻipū — burritos and bowls locals line up for.",
  },
  // ── West Side ─────────────────────────────────────────────────
  {
    id: "waimea-canyon",
    name: "Waimea Canyon Lookout",
    category: "view",
    region: "West",
    lat: 22.07,
    lng: -159.6612,
    blurb:
      "'The Grand Canyon of the Pacific' — a 3,000-ft red-and-green gorge, best mid-morning.",
  },
  {
    id: "kalalau-lookout",
    name: "Kalalau Lookout",
    category: "view",
    region: "West",
    lat: 22.149,
    lng: -159.631,
    blurb:
      "4,000 ft above the Kalalau Valley, peering down the Nā Pali's fluted cliffs — go early before clouds.",
  },
  {
    id: "polihale",
    name: "Polihale State Park",
    category: "beach",
    region: "West",
    lat: 22.083,
    lng: -159.761,
    blurb:
      "Remote 7-mile beach at the end of a rough dirt road, under the Nā Pali's western start.",
  },
  {
    id: "salt-pond",
    name: "Salt Pond Beach",
    category: "beach",
    region: "West",
    lat: 21.905,
    lng: -159.601,
    blurb:
      "Protected swimming beach beside the last working Hawaiian salt-harvesting ponds.",
  },
  {
    id: "hanapepe",
    name: "Hanapēpē Town",
    category: "town",
    region: "West",
    lat: 21.912,
    lng: -159.591,
    blurb:
      "'Kauaʻi's Biggest Little Town' — art galleries, the swinging bridge, and Friday Art Night.",
  },
  {
    id: "ishihara-market",
    name: "Ishihara Market",
    category: "food",
    region: "West",
    lat: 21.956,
    lng: -159.667,
    blurb:
      "Waimea grocery with a legendary poke and plate-lunch counter — fuel up before the canyon.",
  },
  {
    id: "jojos-shave-ice",
    name: "JoJo's Shave Ice",
    category: "food",
    region: "West",
    lat: 21.9572,
    lng: -159.669,
    blurb:
      "Towering, syrup-drenched shave ice in Waimea — the classic post-beach treat.",
  },
];
