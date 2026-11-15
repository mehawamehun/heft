/** Catalog for the HEFT storefront. Mock data — replace with the merchandising feed. */

export type Category = "Outerwear" | "Fleece" | "Denim" | "Pants" | "Shirts";

export type Colourway = {
  label: string;
  hex: string;
};

export type SizeMeasure = {
  size: string;
  waist: string;
  rise: string;
  inseam: string;
  opening: string;
};

export type Product = {
  slug: string;
  name: string;
  category: Category;
  price: number;
  /** Colour shown in the listing line, e.g. "Charcoal, 480 gsm" */
  spec: string;
  colour: string;
  colourways: Colourway[];
  sizes: string[];
  soldOut?: string[];
  image: string;
  backImage?: string;
  fabric: string;
  fit: string;
  madeIn: string;
  care: string;
  sizeRange: string;
  /** Only set for denim: fit table used by the measurements screen. */
  measures?: SizeMeasure[];
};

export type Look = {
  slug: string;
  name: string;
  price: number;
  image: string;
  alt: string;
  /** Product slugs, in the order they appear on the look screen. */
  pieces: string[];
  modelNote: string;
};

export type Order = {
  id: string;
  date: string;
  status: "Delivered" | "In transit";
  total: number;
  itemCount: number;
  items: { slug: string; colour: string; size: string; price: number }[];
  address?: string;
  tracking?: string;
};

const garmentImage = (file: string) => `/assets/heft/garments/${file}`;
const lookImage = (file: string) => `/assets/heft/looks/${file}`;

export const formatPrice = (value: number) =>
  `$${value.toLocaleString("en-US", { minimumFractionDigits: 0, maximumFractionDigits: 2 })}`;

const APPAREL = ["XS", "S", "M", "L", "XL", "XXL"];
const DENIM = ["28", "30", "32", "34"];

export const products: Product[] = [
  {
    slug: "heavyweight-fleece-hoodie",
    name: "Heavyweight Fleece Hoodie",
    category: "Fleece",
    price: 168,
    spec: "Charcoal, 480 gsm",
    colour: "Charcoal",
    colourways: [
      { label: "Charcoal", hex: "#3E4448" },
      { label: "Black", hex: "#15181C" },
      { label: "Stone", hex: "#C9BEA9" },
    ],
    sizes: APPAREL,
    soldOut: ["XL"],
    image: garmentImage("hoodie-charcoal.webp"),
    backImage: garmentImage("hoodie-charcoal-back.webp"),
    fabric: "480 gsm brushed cotton fleece",
    fit: "Oversized, dropped shoulder",
    madeIn: "Portugal",
    care: "Machine wash cold, line dry",
    sizeRange: "XS – XXL",
  },
  {
    slug: "technical-field-jacket",
    name: "Technical Field Jacket",
    category: "Outerwear",
    price: 286,
    spec: "Olive, bonded nylon",
    colour: "Olive",
    colourways: [
      { label: "Olive", hex: "#4F5535" },
      { label: "Black", hex: "#15181C" },
    ],
    sizes: ["S", "M", "L", "XL"],
    image: garmentImage("field-jacket.webp"),
    fabric: "Japanese bonded nylon",
    fit: "Boxy, mid length",
    madeIn: "Japan",
    care: "Wipe clean, do not tumble dry",
    sizeRange: "S – XL",
  },
  {
    slug: "wide-leg-jean-indigo",
    name: "Wide Leg Jeans",
    category: "Denim",
    price: 198,
    spec: "Washed indigo, 14 oz",
    colour: "Washed indigo",
    colourways: [
      { label: "Washed indigo", hex: "#6C86A2" },
      { label: "Black", hex: "#15181C" },
    ],
    sizes: DENIM,
    image: garmentImage("jean-indigo.webp"),
    backImage: garmentImage("jean-indigo-back.webp"),
    fabric: "14 oz rigid denim",
    fit: "Wide leg, low rise",
    madeIn: "Portugal",
    care: "Cold wash, inside out. Line dry",
    sizeRange: "28 – 34",
    measures: [
      { size: "28", waist: "28 in", rise: "11.5 in", inseam: "30 in", opening: "10.5 in" },
      { size: "30", waist: "30 in", rise: "11.5 in", inseam: "30 in", opening: "10.75 in" },
      { size: "32", waist: "32 in", rise: "12 in", inseam: "30 in", opening: "11 in" },
      { size: "34", waist: "34 in", rise: "12.5 in", inseam: "30.5 in", opening: "11.25 in" },
    ],
  },
  {
    slug: "sherpa-fleece-jacket",
    name: "Sherpa Fleece Jacket",
    category: "Fleece",
    price: 232,
    spec: "Stone, 520 gsm",
    colour: "Stone",
    colourways: [
      { label: "Stone", hex: "#C9BEA9" },
      { label: "Charcoal", hex: "#3E4448" },
    ],
    sizes: ["S", "M", "L", "XL"],
    image: garmentImage("sherpa-stone.webp"),
    fabric: "520 gsm sherpa pile",
    fit: "Close fitting, stand collar",
    madeIn: "Portugal",
    care: "Machine wash cold, line dry",
    sizeRange: "S – XL",
  },
  {
    slug: "cropped-technical-bomber",
    name: "Cropped Technical Bomber",
    category: "Outerwear",
    price: 312,
    spec: "Black, bonded nylon",
    colour: "Black",
    colourways: [
      { label: "Black", hex: "#15181C" },
      { label: "Olive", hex: "#4F5535" },
    ],
    sizes: ["S", "M", "L", "XL"],
    image: garmentImage("bomber-black.webp"),
    fabric: "Bonded nylon, taped seams",
    fit: "Cropped, boxy hem",
    madeIn: "Japan",
    care: "Wipe clean, do not tumble dry",
    sizeRange: "S – XL",
  },
  {
    slug: "cargo-wide-pant",
    name: "Cargo Wide Pant",
    category: "Pants",
    price: 186,
    spec: "Olive, ripstop cotton",
    colour: "Olive",
    colourways: [
      { label: "Olive", hex: "#4F5535" },
      { label: "Black", hex: "#15181C" },
    ],
    sizes: DENIM,
    image: garmentImage("cargo-pant.webp"),
    fabric: "Ripstop cotton",
    fit: "Wide leg, mid rise",
    madeIn: "Portugal",
    care: "Machine wash cold, line dry",
    sizeRange: "28 – 34",
    measures: [
      { size: "28", waist: "28 in", rise: "11 in", inseam: "30 in", opening: "11 in" },
      { size: "30", waist: "30 in", rise: "11 in", inseam: "30 in", opening: "11.25 in" },
      { size: "32", waist: "32 in", rise: "11.5 in", inseam: "30 in", opening: "11.5 in" },
      { size: "34", waist: "34 in", rise: "12 in", inseam: "30.5 in", opening: "11.75 in" },
    ],
  },
  {
    slug: "raglan-sweatshirt",
    name: "Raglan Sweatshirt",
    category: "Fleece",
    price: 148,
    spec: "Cream, 460 gsm",
    colour: "Cream",
    colourways: [
      { label: "Cream", hex: "#E7DFCE" },
      { label: "Charcoal", hex: "#3E4448" },
    ],
    sizes: ["XS", "S", "M", "L"],
    image: garmentImage("sweatshirt-cream.webp"),
    fabric: "460 gsm brushed cotton",
    fit: "Relaxed, raglan sleeve",
    madeIn: "Portugal",
    care: "Machine wash cold, line dry",
    sizeRange: "XS – L",
  },
  {
    slug: "striped-long-sleeve",
    name: "Striped Long Sleeve",
    category: "Shirts",
    price: 96,
    spec: "Charcoal, 220 gsm",
    colour: "Charcoal",
    colourways: [{ label: "Charcoal", hex: "#3E4448" }],
    sizes: ["XS", "S", "M", "L"],
    image: garmentImage("striped-long-sleeve.webp"),
    fabric: "220 gsm cotton jersey",
    fit: "Straight, long sleeve",
    madeIn: "Portugal",
    care: "Machine wash cold, line dry",
    sizeRange: "XS – L",
  },
  {
    slug: "heavyweight-hoodie-black",
    name: "Heavyweight Hoodie",
    category: "Fleece",
    price: 178,
    spec: "Black, 480 gsm",
    colour: "Black",
    colourways: [
      { label: "Black", hex: "#15181C" },
      { label: "Charcoal", hex: "#3E4448" },
    ],
    sizes: ["S", "M", "L", "XL"],
    image: garmentImage("hoodie-black.webp"),
    fabric: "480 gsm cotton fleece",
    fit: "Oversized, dropped shoulder",
    madeIn: "Portugal",
    care: "Machine wash cold, line dry",
    sizeRange: "S – XL",
  },
  {
    slug: "wide-leg-jean-black",
    name: "Wide Leg Jeans",
    category: "Denim",
    price: 198,
    spec: "Black, 14 oz overdyed",
    colour: "Black",
    colourways: [
      { label: "Black", hex: "#15181C" },
      { label: "Washed indigo", hex: "#6C86A2" },
    ],
    sizes: DENIM,
    image: garmentImage("jean-black.webp"),
    fabric: "14 oz overdyed denim",
    fit: "Wide leg, low rise",
    madeIn: "Portugal",
    care: "Cold wash, inside out. Line dry",
    sizeRange: "28 – 34",
    measures: [
      { size: "28", waist: "28 in", rise: "11.5 in", inseam: "30 in", opening: "10.5 in" },
      { size: "30", waist: "30 in", rise: "11.5 in", inseam: "30 in", opening: "10.75 in" },
      { size: "32", waist: "32 in", rise: "12 in", inseam: "30 in", opening: "11 in" },
      { size: "34", waist: "34 in", rise: "12.5 in", inseam: "30.5 in", opening: "11.25 in" },
    ],
  },
  {
    slug: "utility-pant",
    name: "Utility Pant",
    category: "Pants",
    price: 174,
    spec: "Black, cotton twill",
    colour: "Black",
    colourways: [
      { label: "Black", hex: "#15181C" },
      { label: "Olive", hex: "#4F5535" },
    ],
    sizes: DENIM,
    image: garmentImage("utility-pant.webp"),
    fabric: "Cotton twill",
    fit: "Wide leg, mid rise",
    madeIn: "Portugal",
    care: "Machine wash cold, line dry",
    sizeRange: "28 – 34",
    measures: [
      { size: "28", waist: "28 in", rise: "11 in", inseam: "30 in", opening: "11 in" },
      { size: "30", waist: "30 in", rise: "11 in", inseam: "30 in", opening: "11.25 in" },
      { size: "32", waist: "32 in", rise: "11.5 in", inseam: "30 in", opening: "11.5 in" },
      { size: "34", waist: "34 in", rise: "12 in", inseam: "30.5 in", opening: "11.75 in" },
    ],
  },
];

export const looks: Look[] = [
  {
    slug: "charcoal-fleece-hoodie",
    name: "Charcoal Fleece Hoodie",
    price: 366,
    image: lookImage("fleece.webp"),
    alt: "Model in a charcoal heavyweight fleece hoodie and washed indigo wide leg jeans",
    pieces: ["heavyweight-fleece-hoodie", "wide-leg-jean-indigo"],
    modelNote: "Model is 186 cm, wearing M and 32",
  },
  {
    slug: "olive-field-jacket",
    name: "Olive Field Jacket",
    price: 472,
    image: lookImage("field.webp"),
    alt: "Model in an olive technical field jacket and olive cargo wide pants",
    pieces: ["technical-field-jacket", "cargo-wide-pant"],
    modelNote: "Model is 174 cm, wearing M and 30",
  },
  {
    slug: "black-fleece-hoodie",
    name: "Black Fleece Hoodie",
    price: 376,
    image: lookImage("black-hoodie.webp"),
    alt: "Model in a black heavyweight fleece hoodie and black wide leg jeans",
    pieces: ["heavyweight-hoodie-black", "wide-leg-jean-black"],
    modelNote: "Model is 182 cm, wearing L and 32",
  },
  {
    slug: "cream-sweatshirt",
    name: "Cream Sweatshirt",
    price: 334,
    image: lookImage("cream-sweatshirt.webp"),
    alt: "Model in a cream heavyweight sweatshirt and olive cargo wide pants",
    pieces: ["raglan-sweatshirt", "cargo-wide-pant"],
    modelNote: "Model is 178 cm, wearing M and 30",
  },
  {
    slug: "black-cropped-bomber",
    name: "Black Cropped Bomber",
    price: 510,
    image: lookImage("bomber.webp"),
    alt: "Model in a black cropped technical bomber and washed indigo wide leg jeans",
    pieces: ["cropped-technical-bomber", "wide-leg-jean-indigo"],
    modelNote: "Model is 186 cm, wearing M and 32",
  },
  {
    slug: "striped-long-sleeve",
    name: "Striped Long Sleeve",
    price: 270,
    image: lookImage("striped.webp"),
    alt: "Model in a charcoal striped long sleeve shirt and black utility pants",
    pieces: ["striped-long-sleeve", "utility-pant"],
    modelNote: "Model is 180 cm, wearing M and 32",
  },
  {
    slug: "stone-sherpa-fleece",
    name: "Stone Sherpa Fleece",
    price: 406,
    image: lookImage("sherpa.webp"),
    alt: "Model in a stone sherpa fleece jacket and black utility pants",
    pieces: ["sherpa-fleece-jacket", "utility-pant"],
    modelNote: "Model is 176 cm, wearing M and 30",
  },
  {
    slug: "sherpa-and-denim",
    name: "Sherpa and Denim",
    price: 430,
    image: lookImage("sherpa-denim.webp"),
    alt: "Model in a stone sherpa fleece jacket over a black tee and washed indigo wide leg jeans",
    pieces: ["sherpa-fleece-jacket", "wide-leg-jean-indigo"],
    modelNote: "Model is 188 cm, wearing L and 34",
  },
];

/** Looks shown on the lookbook screen, in order. */
export const lookbookLooks = [
  "charcoal-fleece-hoodie",
  "olive-field-jacket",
  "black-cropped-bomber",
  "stone-sherpa-fleece",
];

export const categories: { label: Category; count: number }[] = [
  { label: "Outerwear", count: 2 },
  { label: "Fleece", count: 4 },
  { label: "Denim", count: 2 },
  { label: "Pants", count: 2 },
  { label: "Shirts", count: 1 },
];

export const colourFilters: Colourway[] = [
  { label: "Black", hex: "#15181C" },
  { label: "Charcoal", hex: "#3E4448" },
  { label: "Olive", hex: "#4F5535" },
  { label: "Washed indigo", hex: "#6C86A2" },
  { label: "Stone", hex: "#C9BEA9" },
  { label: "Cream", hex: "#E7DFCE" },
];

export const priceBands = [
  { id: "under-150", label: "Under $150", min: 0, max: 149.99 },
  { id: "150-250", label: "$150 – $250", min: 150, max: 250 },
  { id: "over-250", label: "Over $250", min: 250.01, max: Infinity },
] as const;

export const orders: Order[] = [
  {
    id: "OL-24815",
    date: "02 Nov 2026",
    status: "Delivered",
    total: 366,
    itemCount: 2,
    items: [
      { slug: "heavyweight-fleece-hoodie", colour: "Charcoal", size: "M", price: 168 },
      { slug: "wide-leg-jean-indigo", colour: "Washed indigo", size: "32", price: 198 },
    ],
    address: "Amara Okafor, 1417 SE Morrison Street, Portland, OR 97214",
    tracking: "1Z999AA10123456784",
  },
  {
    id: "OL-24722",
    date: "18 Oct 2026",
    status: "Delivered",
    total: 514,
    itemCount: 2,
    items: [
      { slug: "technical-field-jacket", colour: "Olive", size: "M", price: 286 },
      { slug: "sherpa-fleece-jacket", colour: "Stone", size: "M", price: 232 },
    ],
  },
  {
    id: "OL-24609",
    date: "04 Oct 2026",
    status: "In transit",
    total: 186,
    itemCount: 1,
    items: [{ slug: "cargo-wide-pant", colour: "Olive", size: "32", price: 186 }],
  },
];

export const account = {
  email: "a.okafor@fastmail.com",
  name: "Amara Okafor",
  address: "1417 SE Morrison Street, Portland, OR 97214",
};

export function getProduct(slug: string) {
  return products.find((product) => product.slug === slug);
}

export function getLook(slug: string) {
  return looks.find((look) => look.slug === slug);
}

export function lookPieces(look: Look) {
  return look.pieces
    .map((slug) => getProduct(slug))
    .filter((product): product is Product => Boolean(product));
}

export function lookForProduct(slug: string) {
  return looks.find((look) => look.pieces.includes(slug));
}

export function relatedProducts(product: Product, limit = 4) {
  const sameCategory = products.filter(
    (candidate) => candidate.slug !== product.slug && candidate.category === product.category,
  );
  const rest = products.filter(
    (candidate) => candidate.slug !== product.slug && candidate.category !== product.category,
  );
  return [...sameCategory, ...rest].slice(0, limit);
}
