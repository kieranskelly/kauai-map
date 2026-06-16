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
  | "view"
  | "hike"
  | "waterfall"
  | "sight"
  | "food"
  | "coffee"
  | "treats"
  | "drinks"
  | "grocery"
  | "town"
  | "stay";

export interface Category {
  label: string;
  emoji: string;
  color: string;
}

// Colors mirror Kieran's Google My Maps color groups (beaches=blue, food=yellow,
// coffee=red, hikes=green, waterfalls=deep blue, treats=green, drinks=pink,
// sights=olive, grocery=amber, views/scenic-stops=wine-red). Order here is the
// order the filter chips render in.
export const CATEGORIES: Record<CategoryKey, Category> = {
  beach: { label: "Beaches", emoji: "🏖️", color: "#0288d1" },
  view: { label: "Views", emoji: "🌄", color: "#880e4f" },
  hike: { label: "Hikes", emoji: "🥾", color: "#097138" },
  waterfall: { label: "Falls", emoji: "💧", color: "#01579b" },
  sight: { label: "Sights", emoji: "✨", color: "#817717" },
  food: { label: "Food", emoji: "🍽️", color: "#ffea00" },
  coffee: { label: "Coffee", emoji: "☕", color: "#ff5252" },
  treats: { label: "Treats", emoji: "🍧", color: "#0f9d58" },
  drinks: { label: "Drinks", emoji: "🍹", color: "#c2185b" },
  grocery: { label: "Grocery", emoji: "🛒", color: "#f9a825" },
  town: { label: "Towns", emoji: "🏘️", color: "#64748b" },
  stay: { label: "Stay", emoji: "🛏️", color: "#0d9488" },
};

export const CATEGORY_KEYS = Object.keys(CATEGORIES) as CategoryKey[];

// Readable text (near-black or white) to lay over a category color, by luminance.
// Needed because some My Maps colors (yellow food, amber grocery) are too light
// for white text on the filter chips / card badge.
export function textOn(hex: string): string {
  const c = hex.replace("#", "");
  const r = parseInt(c.slice(0, 2), 16);
  const g = parseInt(c.slice(2, 4), 16);
  const b = parseInt(c.slice(4, 6), 16);
  const L = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return L > 0.6 ? "#1a1a1a" : "#ffffff";
}

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
    id: "common-ground-kauai",
    name: "Common Ground Kauai",
    category: "sight",
    region: "North",
    lat: 22.1968662,
    lng: -159.4199641,
    blurb:
      "Farm-to-table café and market on a regenerative-ag campus in Kīlauea.",
  },
  {
    id: "waioli-mission-house",
    name: "Waiʻoli Mission House",
    category: "sight",
    region: "North",
    lat: 22.1994797,
    lng: -159.5013946,
    blurb: "1830s mission-house museum on Hanalei's historic green.",
  },
  {
    id: "foodland-princeville",
    name: "Foodland Princeville",
    category: "grocery",
    region: "North",
    lat: 22.2137938,
    lng: -159.4747524,
    blurb:
      "Princeville grocery with a solid poke counter — stock up for the North Shore.",
  },
  {
    id: "haena-state-park",
    name: "Hāʻena State Park",
    category: "hike",
    region: "North",
    lat: 22.2205851,
    lng: -159.5774698,
    blurb:
      "End-of-the-road park: Kēʻē Beach and the Nā Pali (Kalalau) trailhead. Reservations required.",
  },
  {
    id: "hanalei-town",
    name: "Hanalei",
    category: "town",
    region: "North",
    lat: 22.2046,
    lng: -159.4994,
    blurb:
      "Laid-back North Shore town behind the bay — galleries, taro fields, surf shops, and shave ice.",
  },
  {
    id: "princeville",
    name: "Princeville",
    category: "town",
    region: "North",
    lat: 22.2233,
    lng: -159.4869,
    blurb:
      "Cliff-top resort community above Hanalei Bay — golf, ocean lookouts, and the Queen's Bath trail.",
  },
  {
    id: "kilauea-town",
    name: "Kīlauea",
    category: "town",
    region: "North",
    lat: 22.2113,
    lng: -159.4147,
    blurb:
      "Quiet former plantation town — Kong Lung shops, bakeries, the lighthouse, and fish market.",
  },
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
    category: "beach",
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
    category: "beach",
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
    category: "drinks",
    region: "North",
    lat: 22.2206,
    lng: -159.4972,
    blurb: "Sunset drinks at the resort's oceanfront bar above Hanalei Bay.",
  },
  {
    id: "the-haven",
    name: "the haven",
    category: "coffee",
    region: "North",
    lat: 22.2129,
    lng: -159.541,
    blurb: "North Shore coffee shop out toward Wainiha. (Confirm exact spot.)",
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
    category: "waterfall",
    region: "North",
    lat: 22.1858,
    lng: -159.595,
    blurb:
      "300-ft falls 4 miles up the Kalalau Trail past Hanakāpīʻai Beach — strenuous, stream crossings, all-day. ⚠️",
  },
  {
    id: "na-pali-coast",
    name: "Nā Pali Coast",
    category: "hike",
    region: "North",
    lat: 22.1682,
    lng: -159.6577,
    blurb:
      "The island's signature fluted sea cliffs — seen by boat, helicopter, or the Kalalau Trail.",
  },

  // ══ East Side ═════════════════════════════════════════════════
  {
    id: "kauai-museum",
    name: "Kauaʻi Museum",
    category: "sight",
    region: "East",
    lat: 21.975035,
    lng: -159.368253,
    blurb:
      "Līhuʻe museum of the island's geology, history, and Hawaiian culture.",
  },
  {
    id: "grove-farm-museum",
    name: "Grove Farm Museum",
    category: "sight",
    region: "East",
    lat: 21.9654673,
    lng: -159.369151,
    blurb:
      "Preserved 19th-century sugar-plantation homestead and museum near Līhuʻe.",
  },
  {
    id: "hikinaakala-heiau",
    name: "Hikinaʻakala Heiau",
    category: "sight",
    region: "East",
    lat: 22.0423824,
    lng: -159.3355376,
    blurb:
      "Ancient heiau and place of refuge at the mouth of the Wailua River.",
  },
  {
    id: "kauai-plantation-railway",
    name: "Kauaʻi Plantation Railway",
    category: "sight",
    region: "East",
    lat: 21.9711103,
    lng: -159.3923377,
    blurb: "Scenic plantation train ride through Kilohana Estate near Līhuʻe.",
  },
  {
    id: "luau-kalamaku",
    name: "Lūʻau Kalamaku",
    category: "sight",
    region: "East",
    lat: 21.9712528,
    lng: -159.3921194,
    blurb: "Theatrical lūʻau and Polynesian show at Kilohana Estate.",
  },
  {
    id: "kapaa-town",
    name: "Kapaʻa",
    category: "town",
    region: "East",
    lat: 22.0753,
    lng: -159.319,
    blurb:
      "The east side's lively hub — beach-town shops, food trucks, cafés, and the coastal path.",
  },
  {
    id: "wailua",
    name: "Wailua",
    category: "town",
    region: "East",
    lat: 22.0469,
    lng: -159.3387,
    blurb:
      "Riverside area south of Kapaʻa — the Wailua River, roadside falls, and sacred Hawaiian sites.",
  },
  {
    id: "lihue-town",
    name: "Līhuʻe",
    category: "town",
    region: "East",
    lat: 21.9789,
    lng: -159.3711,
    blurb:
      "Kauaʻi's county seat and arrival hub — the airport, harbor, and everyday shops and eats.",
  },
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
    category: "hike",
    region: "East",
    lat: 22.0866,
    lng: -159.338,
    blurb:
      "Breezy coastal walking & biking path threading Kapaʻa's beaches and laid-back town.",
  },
  {
    id: "kipu-ranch-adventures",
    name: "Kipu Ranch Adventures",
    category: "sight",
    region: "East",
    lat: 21.9505,
    lng: -159.4216,
    blurb:
      "ATV and movie-location tours across a private ranch (Jurassic Park, Indiana Jones, and more filmed here).",
  },
  {
    id: "hele-on-bike-rentals",
    name: "Hele On Kauai Bike Rentals",
    category: "sight",
    region: "East",
    lat: 22.0744,
    lng: -159.3188,
    blurb: "Bike rentals right by the Kapaʻa coastal path.",
  },
  {
    id: "bikram-yoga-kauai",
    name: "Bikram Yoga HI Kauai",
    category: "sight",
    region: "East",
    lat: 22.0629,
    lng: -159.3205,
    blurb: "Hot-yoga studio on the east side.",
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
    category: "drinks",
    region: "East",
    lat: 22.0762,
    lng: -159.3179,
    blurb: "Coffee & espresso stop in Kapaʻa.",
  },
  {
    id: "mokihana-coffee",
    name: "Mokihana Coffee Co.",
    category: "coffee",
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
    category: "sight",
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
    category: "coffee",
    region: "East",
    lat: 21.9592,
    lng: -159.3532,
    blurb: "Coffee company near Līhuʻe.",
  },
  {
    id: "blue-bird-kauai",
    name: "Blue Bird Kauai",
    category: "coffee",
    region: "East",
    lat: 21.9711,
    lng: -159.3625,
    blurb: "Café/eatery near Līhuʻe.",
  },
  {
    id: "rainbeau-jos",
    name: "Rainbeau Jo's",
    category: "coffee",
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
    id: "koloa-jodo-mission",
    name: "Koloa Jodo Mission",
    category: "sight",
    region: "South",
    lat: 21.905043,
    lng: -159.46242,
    blurb: "Historic Buddhist temple in Old Kōloa Town.",
  },
  {
    id: "labyrinth-momilanikai",
    name: "Labyrinth at MomiLaniKai",
    category: "sight",
    region: "South",
    lat: 21.893623,
    lng: -159.405753,
    blurb: "Oceanfront meditation labyrinth on the Poʻipū/Māhāʻulepu coast.",
  },
  {
    id: "makauwahi-cave-trail",
    name: "Makauwahi Cave Trail",
    category: "hike",
    region: "South",
    lat: 21.887552,
    lng: -159.419056,
    blurb:
      "Short trail to Makauwahi — Hawaiʻi's largest limestone cave/sinkhole, on the Māhāʻulepu coast.",
  },
  {
    id: "makawehi-bluff",
    name: "Makawehi Bluff Viewpoint",
    category: "sight",
    region: "South",
    lat: 21.878251,
    lng: -159.429883,
    blurb:
      "Lithified-cliff bluff walk above Shipwreck Beach with wide ocean views.",
  },
  {
    id: "bikeit-poipu",
    name: "BikeIt Poʻipū — Kauaʻi Ebike Tours",
    category: "sight",
    region: "South",
    lat: 21.9052862,
    lng: -159.4639758,
    blurb: "Guided e-bike tours and rentals out of Old Kōloa Town.",
  },
  {
    id: "crumb-and-get-it",
    name: "Crumb & Get It",
    category: "food",
    region: "South",
    lat: 21.8789771,
    lng: -159.4587029,
    blurb: "Poʻipū bakery — pastries, breads, and breakfast bites.",
  },
  {
    id: "little-fish-coffee-poipu",
    name: "Little Fish Coffee — Poʻipū",
    category: "coffee",
    region: "South",
    lat: 21.878309,
    lng: -159.4577481,
    blurb: "The Poʻipū outpost of the Little Fish coffee + açaí bar.",
  },
  {
    id: "puka-dog",
    name: "Puka Dog",
    category: "food",
    region: "South",
    lat: 21.8738762,
    lng: -159.453389,
    blurb:
      "Famously Hawaiian hot dogs with tropical relishes and lilikoʻi mustard at Poʻipū.",
  },
  {
    id: "lava-arch",
    name: "Lava Arch",
    category: "sight",
    region: "South",
    lat: 21.8687428,
    lng: -159.4449227,
    blurb: "Sea-carved lava arch along the wild Mahaʻulepu coast.",
  },
  {
    id: "mcbryde-allerton-garden",
    name: "McBryde & Allerton Garden",
    category: "sight",
    region: "South",
    lat: 21.8863515,
    lng: -159.4927257,
    blurb:
      "Two National Tropical Botanical Gardens in the lush Lāwaʻi Valley (guided tours).",
  },
  {
    id: "prince-kuhio-birthplace",
    name: "Prince Kūhiō Birthplace",
    category: "sight",
    region: "South",
    lat: 21.8819272,
    lng: -159.4734496,
    blurb: "Memorial park at the birthplace of Prince Jonah Kūhiō, near Poʻipū.",
  },
  {
    id: "sea-turtle-viewpoint",
    name: "Sea Turtle Viewing Point",
    category: "sight",
    region: "South",
    lat: 21.873261,
    lng: -159.453838,
    blurb:
      "Roped-off beach stretch where green sea turtles haul out to rest, by Poʻipū. Keep your distance.",
  },
  {
    id: "secret-beach",
    name: "Secret Beach",
    category: "beach",
    region: "South",
    lat: 21.8913889,
    lng: -159.5483333,
    blurb: "A tucked-away beach off the beaten path.",
  },
  {
    id: "koloa-landing",
    name: "Koloa Landing",
    category: "sight",
    region: "South",
    lat: 21.8789422,
    lng: -159.4682774,
    blurb:
      "Calm, protected cove — one of the south shore's easiest shore snorkels and dives.",
  },
  {
    id: "poipu-shopping-village",
    name: "Poʻipū Shopping Village",
    category: "sight",
    region: "South",
    lat: 21.8793263,
    lng: -159.4592063,
    blurb: "Open-air shops and dining with a free evening hula show in Poʻipū.",
  },
  {
    id: "poipu-town",
    name: "Poʻipū",
    category: "town",
    region: "South",
    lat: 21.8836,
    lng: -159.4585,
    blurb:
      "Sunny south-shore resort area — beaches, snorkeling, restaurants, and the island's most reliable weather.",
  },
  {
    id: "poipu-beach",
    name: "Poʻipū Beach Park",
    category: "sight",
    region: "South",
    lat: 21.873627,
    lng: -159.4547973,
    blurb:
      "Sunny south-shore beach with a protected keiki pool, snorkeling, and basking monk seals.",
  },
  {
    id: "shipwreck-beach",
    name: "Shipwreck Beach",
    category: "sight",
    region: "South",
    lat: 21.8747911,
    lng: -159.4369036,
    blurb:
      "Wide sandy beach below the Makawehi lithified cliffs — a local cliff-jump spot.",
  },
  {
    id: "mahaulepu",
    name: "Mahaʻulepu Heritage Trail",
    category: "hike",
    region: "South",
    lat: 21.884103,
    lng: -159.418971,
    blurb:
      "Wild, undeveloped coastal trail over sea cliffs, dunes, and sinkholes east of Shipwreck.",
  },
  {
    id: "spouting-horn",
    name: "Spouting Horn",
    category: "sight",
    region: "South",
    lat: 21.8847695,
    lng: -159.4932028,
    blurb:
      "Lava-tube blowhole that geysers seawater and moans with each incoming swell.",
  },
  {
    id: "tree-tunnel",
    name: "Tree Tunnel",
    category: "view",
    region: "South",
    lat: 21.949,
    lng: -159.4661,
    blurb:
      "Mile-long eucalyptus canopy arching over Maluhia Road as you enter Kōloa.",
  },
  {
    id: "old-koloa-town",
    name: "Kōloa",
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
    category: "treats",
    region: "South",
    lat: 21.9229,
    lng: -159.5078,
    blurb: "Shave ice in the Kōloa/Poʻipū area.",
  },

  // ══ West Side ═════════════════════════════════════════════════
  {
    id: "kilohana-lookout",
    name: "Kilohana Lookout",
    category: "hike",
    region: "West",
    lat: 22.156469,
    lng: -159.59367,
    blurb: "Pihea Trail lookout over the Kalalau Valley, deep in Kōkeʻe.",
  },
  {
    id: "japanese-grandmas-cafe",
    name: "Japanese Grandma's Cafe",
    category: "food",
    region: "West",
    lat: 21.9115573,
    lng: -159.5865562,
    blurb: "Sushi and Japanese comfort food in artsy Hanapēpē.",
  },
  {
    id: "hanapepe-swinging-bridge",
    name: "Hanapēpē Swinging Bridge",
    category: "sight",
    region: "West",
    lat: 21.9123512,
    lng: -159.5868589,
    blurb: "The wobbly pedestrian suspension bridge over the Hanapēpē River.",
  },
  {
    id: "kokee-museum",
    name: "Kōkeʻe Natural History Museum",
    category: "sight",
    region: "West",
    lat: 22.1303222,
    lng: -159.6575988,
    blurb:
      "Trail maps, weather, and natural history at 3,600 ft in Kōkeʻe State Park.",
  },
  {
    id: "mcbryde-cemetery",
    name: "McBryde Plantation Cemetery",
    category: "sight",
    region: "West",
    lat: 21.897117,
    lng: -159.5826355,
    blurb: "Historic plantation-era cemetery in the hills above Hanapēpē.",
  },
  {
    id: "manawaiopuna-falls",
    name: "Manawaiopuna Falls",
    category: "waterfall",
    region: "West",
    lat: 21.9913889,
    lng: -159.5286111,
    blurb:
      "The 400-ft 'Jurassic Park' falls in a private valley — seen only by helicopter.",
  },
  {
    id: "waimea-town",
    name: "Waimea",
    category: "town",
    region: "West",
    lat: 21.9569,
    lng: -159.6679,
    blurb:
      "Historic west-side town at the canyon's foot — Captain Cook's landing, plate lunch, and shave ice.",
  },
  {
    id: "kekaha",
    name: "Kekaha",
    category: "town",
    region: "West",
    lat: 21.9686,
    lng: -159.7186,
    blurb:
      "The island's westernmost town — a long sunny beach and the gateway to Polihale and the canyon.",
  },
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
    category: "view",
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
    category: "hike",
    region: "West",
    lat: 22.0794713,
    lng: -159.7647939,
    blurb:
      "Remote 7-mile beach at the end of a rough dirt road, under the Nā Pali's western start.",
  },
  {
    id: "salt-pond",
    name: "Salt Pond Beach",
    category: "beach",
    region: "West",
    lat: 21.9003555,
    lng: -159.6072986,
    blurb:
      "Protected swimming beach beside the last working Hawaiian salt-harvesting ponds.",
  },
  {
    id: "hanapepe",
    name: "Hanapēpē",
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
    category: "coffee",
    region: "West",
    lat: 21.9084,
    lng: -159.5923,
    blurb: "Coffee bar with açaí bowls in artsy Hanapēpē.",
  },
  {
    id: "coconut-corner",
    name: "Coconut Corner",
    category: "treats",
    region: "West",
    lat: 21.9569,
    lng: -159.6715,
    blurb: "Smoothies and quick bites near Waimea.",
  },
];
