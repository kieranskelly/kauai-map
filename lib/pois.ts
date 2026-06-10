// Kauaʻi points of interest.
//
// Two sources, merged:
//   • a base set of well-known spots, and
//   • Kieran's own pins imported from Google My Maps ("California & Hawaii" →
//     "Kauai" folder, 47 pins). Where the two overlapped (Keʻe, Tunnels,
//     Queen's Bath, Tree Tunnel, Waimea Canyon, Kalalau Lookout, Sleeping
//     Giant) the My-Maps pin won — its coordinates are the trip's source of
//     truth. Coordinates are lat/lng; tune freely.

export type CategoryKey =
  | "beach"
  | "hike"
  | "view"
  | "waterfall"
  | "sight"
  | "food"
  | "town"
  | "stay"
  | "do";

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
  stay: { label: "Stay", emoji: "🛏️", color: "#0d9488" },
  do: { label: "Do", emoji: "🤿", color: "#7c3aed" },
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
  // ══ North Shore ═══════════════════════════════════════════════
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
    id: "hanalei-pier",
    name: "Hanalei Pier",
    category: "sight",
    region: "North",
    lat: 22.2126,
    lng: -159.4982,
    blurb: "Historic 1892 pier reaching into Hanalei Bay — the postcard shot.",
  },
  {
    id: "anini-beach",
    name: "ʻAnini Beach",
    category: "beach",
    region: "North",
    lat: 22.2232,
    lng: -159.463,
    blurb:
      "Calm, reef-protected lagoon behind one of Hawaiʻi's longest fringing reefs — among the island's safest swims.",
  },
  {
    id: "hideaways-beach",
    name: "Hideaways Beach",
    category: "beach",
    region: "North",
    lat: 22.2233,
    lng: -159.4956,
    blurb:
      "Tucked-away Princeville snorkel cove reached by a steep, rope-assisted path down the cliff.",
  },
  {
    id: "queens-bath",
    name: "Queen's Bath",
    category: "sight",
    region: "North",
    lat: 22.2292,
    lng: -159.4874,
    blurb:
      "Princeville lava-shelf tide-pool — gorgeous, but only safe in low summer/winter calm. Deadly in surf. ⚠️",
  },
  {
    id: "kilauea-lighthouse",
    name: "Kīlauea Lighthouse",
    category: "sight",
    region: "North",
    lat: 22.2317,
    lng: -159.402,
    blurb:
      "1913 lighthouse on Kīlauea Point — a seabird refuge with nēnē, red-footed boobies, and frigatebirds.",
  },
  {
    id: "kilauea-fish-market",
    name: "Kīlauea Fish Market",
    category: "food",
    region: "North",
    lat: 22.2121,
    lng: -159.4082,
    blurb: "Poke bowls, fish tacos, and plate lunches in Kīlauea town.",
  },
  {
    id: "wake-up-delicious",
    name: "Wake Up Delicious",
    category: "food",
    region: "North",
    lat: 22.2033,
    lng: -159.4955,
    blurb: "Hanalei breakfast & smoothie spot (a.k.a. Trucking Delicious).",
  },
  {
    id: "one-hotel-hanalei-bay",
    name: "1 Hotel Hanalei Bay",
    category: "stay",
    region: "North",
    lat: 22.2206,
    lng: -159.4972,
    blurb: "Luxury sustainability-minded resort above Hanalei Bay.",
  },
  {
    id: "the-haven",
    name: "the haven",
    category: "stay",
    region: "North",
    lat: 22.2129,
    lng: -159.541,
    blurb: "North Shore stay/retreat out toward Wainiha. (Confirm details.)",
  },
  {
    id: "lumahai-beach",
    name: "Lumahaʻi Beach",
    category: "beach",
    region: "North",
    lat: 22.2161,
    lng: -159.5302,
    blurb:
      "The stunning 'South Pacific' beach — breathtaking to look at, treacherous shorebreak to swim. ⚠️",
  },
  {
    id: "tunnels-beach",
    name: "Tunnels Beach (Makua)",
    category: "beach",
    region: "North",
    lat: 22.2239,
    lng: -159.5611,
    blurb:
      "Horseshoe reef with arguably the island's best snorkeling on calm summer days.",
  },
  {
    id: "kee-beach",
    name: "Kēʻē Beach",
    category: "beach",
    region: "North",
    lat: 22.2235,
    lng: -159.5798,
    blurb:
      "End-of-the-road reef lagoon and the gateway to the Nā Pali coast. State-park reservation required.",
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
    id: "hanakapiai-falls",
    name: "Hanakāpīʻai Falls",
    category: "hike",
    region: "North",
    lat: 22.1858,
    lng: -159.595,
    blurb:
      "300-ft falls 4 miles up the Kalalau Trail past Hanakāpīʻai Beach — strenuous, stream crossings, all-day. ⚠️",
  },
  {
    id: "na-pali-coast",
    name: "Nā Pali Coast",
    category: "view",
    region: "North",
    lat: 22.1682,
    lng: -159.6577,
    blurb:
      "The island's signature fluted sea cliffs — seen by boat, helicopter, or the Kalalau Trail.",
  },

  // ══ East Side ═════════════════════════════════════════════════
  {
    id: "sleeping-giant-east",
    name: "Sleeping Giant — East Trailhead",
    category: "hike",
    region: "East",
    lat: 22.0614,
    lng: -159.3466,
    blurb:
      "Nounou (Sleeping Giant) ridge trail, eastern approach — switchbacks to summit views over the coast.",
  },
  {
    id: "sleeping-giant-west",
    name: "Sleeping Giant — West Trailhead",
    category: "hike",
    region: "East",
    lat: 22.0677,
    lng: -159.3589,
    blurb:
      "Western, forested approach to the Nounou ridge trail and the reclining-giant silhouette.",
  },
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
    id: "kealia-beach",
    name: "Keālia Beach",
    category: "beach",
    region: "East",
    lat: 22.0993,
    lng: -159.3046,
    blurb:
      "Wide Kapaʻa surf beach along the coastal path — bodyboarding and a lifeguard.",
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
  {
    id: "lihue-airport",
    name: "Līhuʻe Airport",
    category: "do",
    region: "East",
    lat: 21.9788,
    lng: -159.3438,
    blurb: "Kauaʻi's main airport (LIH) — your arrival and departure hub.",
  },
  {
    id: "kipu-ranch-adventures",
    name: "Kipu Ranch Adventures",
    category: "do",
    region: "East",
    lat: 21.9505,
    lng: -159.4216,
    blurb:
      "ATV and movie-location tours across a private ranch (Jurassic Park, Indiana Jones, and more filmed here).",
  },
  {
    id: "hele-on-bike-rentals",
    name: "Hele On Kauai Bike Rentals",
    category: "do",
    region: "East",
    lat: 22.0744,
    lng: -159.3188,
    blurb: "Bike rentals right by the Kapaʻa coastal path.",
  },
  {
    id: "bikram-yoga-kauai",
    name: "Bikram Yoga HI Kauai",
    category: "do",
    region: "East",
    lat: 22.0629,
    lng: -159.3205,
    blurb: "Hot-yoga studio on the east side.",
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
    id: "chicken-in-a-barrel",
    name: "Chicken in a Barrel",
    category: "food",
    region: "East",
    lat: 22.0803,
    lng: -159.3137,
    blurb: "Smoky barrel-smoked BBQ — a Kapaʻa staple.",
  },
  {
    id: "the-flying-saucer",
    name: "The Flying Saucer",
    category: "food",
    region: "East",
    lat: 22.0762,
    lng: -159.3179,
    blurb: "Coffee & espresso stop in Kapaʻa.",
  },
  {
    id: "mokihana-coffee",
    name: "Mokihana Coffee Co.",
    category: "food",
    region: "East",
    lat: 22.0798,
    lng: -159.3147,
    blurb: "Kapaʻa coffee roaster and café.",
  },
  {
    id: "wailua-bakeshop",
    name: "Wailua Bakeshop",
    category: "food",
    region: "East",
    lat: 22.0742,
    lng: -159.3189,
    blurb: "Bakeshop and pastries on the east side.",
  },
  {
    id: "musubi-truck-kapaa",
    name: "The Musubi Truck — Kapaʻa",
    category: "food",
    region: "East",
    lat: 22.0761,
    lng: -159.3198,
    blurb: "Spam musubi and local plates from the truck in Kapaʻa.",
  },
  {
    id: "fish-bar-deli",
    name: "Fish Bar Deli",
    category: "food",
    region: "East",
    lat: 22.0762,
    lng: -159.318,
    blurb: "Poke and seafood deli in Kapaʻa.",
  },
  {
    id: "lanas-cafe",
    name: "Lana's Cafe",
    category: "food",
    region: "East",
    lat: 22.0751,
    lng: -159.3185,
    blurb: "Local café in Kapaʻa.",
  },
  {
    id: "moloaa-organicaa",
    name: "Moloaʻa Organicaʻa",
    category: "food",
    region: "East",
    lat: 22.1831,
    lng: -159.3262,
    blurb: "Organic smoothies and bites on the quiet Moloaʻa side.",
  },
  {
    id: "konohiki-seafoods",
    name: "Konohiki Seafoods",
    category: "food",
    region: "East",
    lat: 21.9958,
    lng: -159.3538,
    blurb: "Fresh poke counter near Līhuʻe.",
  },
  {
    id: "kind-koffee",
    name: "Kind Koffee Company",
    category: "food",
    region: "East",
    lat: 21.9592,
    lng: -159.3532,
    blurb: "Coffee company near Līhuʻe.",
  },
  {
    id: "blue-bird-kauai",
    name: "Blue Bird Kauai",
    category: "food",
    region: "East",
    lat: 21.9711,
    lng: -159.3625,
    blurb: "Café/eatery near Līhuʻe.",
  },
  {
    id: "rainbeau-jos",
    name: "Rainbeau Jo's",
    category: "food",
    region: "East",
    lat: 21.9742,
    lng: -159.3674,
    blurb: "Eatery near Līhuʻe.",
  },
  {
    id: "sushi-blue-wave",
    name: "Sushi Blue Wave",
    category: "food",
    region: "East",
    lat: 21.9785,
    lng: -159.368,
    blurb: "Sushi near Līhuʻe.",
  },
  {
    id: "kauai-sushi-station",
    name: "Kauaʻi Sushi Station",
    category: "food",
    region: "East",
    lat: 21.9682,
    lng: -159.3835,
    blurb: "Sushi on the east side.",
  },

  // ══ South Shore ═══════════════════════════════════════════════
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
    id: "tree-tunnel",
    name: "Tree Tunnel",
    category: "sight",
    region: "South",
    lat: 21.949,
    lng: -159.4661,
    blurb:
      "Mile-long eucalyptus canopy arching over Maluhia Road as you enter Kōloa.",
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
  {
    id: "koloa-fish-market",
    name: "Kōloa Fish Market",
    category: "food",
    region: "South",
    lat: 21.902,
    lng: -159.4662,
    blurb: "Counter poke and plate lunches in Old Kōloa Town.",
  },
  {
    id: "musubi-truck-koloa",
    name: "The Musubi Truck — Kōloa",
    category: "food",
    region: "South",
    lat: 21.903,
    lng: -159.4663,
    blurb: "Spam musubi and local plates from the truck in Kōloa.",
  },
  {
    id: "kauai-juice-co-koloa",
    name: "Kauai Juice Co — Kōloa",
    category: "food",
    region: "South",
    lat: 21.9045,
    lng: -159.4643,
    blurb: "Cold-pressed juice and kombucha in Old Kōloa.",
  },
  {
    id: "waikomo-shave-ice",
    name: "Waikomo Shave Ice",
    category: "food",
    region: "South",
    lat: 21.9229,
    lng: -159.5078,
    blurb: "Shave ice in the Kōloa/Poʻipū area.",
  },

  // ══ West Side ═════════════════════════════════════════════════
  {
    id: "waimea-canyon-lookout",
    name: "Waimea Canyon Lookout",
    category: "view",
    region: "West",
    lat: 22.0718,
    lng: -159.6616,
    blurb:
      "'The Grand Canyon of the Pacific' — a 3,000-ft red-and-green gorge, best mid-morning.",
  },
  {
    id: "red-dirt-waterfall",
    name: "Red Dirt Waterfall",
    category: "waterfall",
    region: "West",
    lat: 22.0093,
    lng: -159.677,
    blurb:
      "Iron-stained roadside falls on the climb up Waimea Canyon Drive — a quick photo stop.",
  },
  {
    id: "kalalau-lookout",
    name: "Kalalau Lookout",
    category: "view",
    region: "West",
    lat: 22.1511,
    lng: -159.646,
    blurb:
      "4,000 ft above the Kalalau Valley, peering down the Nā Pali's fluted cliffs — go early before clouds.",
  },
  {
    id: "puu-o-kila-lookout",
    name: "Puʻu O Kila Lookout",
    category: "view",
    region: "West",
    lat: 22.1479,
    lng: -159.6309,
    blurb:
      "End-of-the-road lookout just past Kalalau, over the valley and the start of the Pihea Trail.",
  },
  {
    id: "kalepa-ridge",
    name: "Kālepa Ridge Trail",
    category: "hike",
    region: "West",
    lat: 22.1661,
    lng: -159.6636,
    blurb:
      "Exposed, unofficial ridge trail off Kalalau Lookout with staggering Nā Pali drop-offs. ⚠️",
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
    id: "little-fish-coffee-hanapepe",
    name: "Little Fish Coffee — Hanapēpē",
    category: "food",
    region: "West",
    lat: 21.9084,
    lng: -159.5923,
    blurb: "Coffee bar with açaí bowls in artsy Hanapēpē.",
  },
  {
    id: "coconut-corner",
    name: "Coconut Corner",
    category: "food",
    region: "West",
    lat: 21.9569,
    lng: -159.6715,
    blurb: "Smoothies and quick bites near Waimea.",
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
