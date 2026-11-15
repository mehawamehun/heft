export const navLinks = [
  { label: "Shop", href: "/collections/shop" },
  { label: "Collections", href: "/collections" },
  { label: "Lookbook", href: "/lookbook" },
  { label: "Journal", href: "/journal" },
];

export const footerColumns = [
  {
    title: "Shop",
    links: [
      { label: "Outerwear", href: "/collections/outerwear" },
      { label: "Fleece", href: "/collections/fleece" },
      { label: "Denim", href: "/collections/denim" },
      { label: "Pants", href: "/collections/pants" },
      { label: "All pieces", href: "/collections/shop" },
    ],
  },
  {
    title: "Help",
    links: [
      { label: "Shipping", href: "/help/shipping" },
      { label: "Returns", href: "/help/returns" },
      { label: "Size guide", href: "/help/size-guide" },
      { label: "Care", href: "/help/care" },
      { label: "Contact", href: "/help/contact" },
    ],
  },
  {
    title: "About",
    links: [
      { label: "Lookbook", href: "/lookbook" },
      { label: "Journal", href: "/journal" },
      { label: "Stores", href: "/stores" },
      { label: "Account", href: "/account" },
    ],
  },
];

export const articleCopy: Record<string, { title: string; lines: string[] }> = {
  "/journal": {
    title: "Journal",
    lines: [
      "Studio notes, fabric reports and fit breakdowns from the Fall / Winter 26 collection.",
      "The first entry lands with the November drop.",
    ],
  },
  "/stores": {
    title: "Stores",
    lines: [
      "Portland studio — 1417 SE Morrison Street. Open Thursday to Sunday, 11:00–18:00.",
      "Tokyo showroom — 2-11-6 Jingumae, Shibuya. Appointments only.",
    ],
  },
  "/help/shipping": {
    title: "Shipping",
    lines: [
      "Orders ship from Portland within one business day.",
      "Standard delivery is free over $150 and arrives in 3–5 business days. Express is $12 and arrives in 1–2 business days.",
    ],
  },
  "/help/returns": {
    title: "Returns",
    lines: [
      "Returns are accepted within 30 days of delivery. Pieces must be unworn with tags attached.",
      "Start a return from your account and print the prepaid label.",
    ],
  },
  "/help/size-guide": {
    title: "Size guide",
    lines: [
      "Apparel runs XS–XXL. Fleece and outerwear are cut oversized; take your usual size for the intended fit.",
      "Denim runs 28–34 in waist. Measurements are taken flat, in inches.",
    ],
  },
  "/help/care": {
    title: "Care",
    lines: [
      "Wash fleece cold, inside out, and line dry. Denim should be washed sparingly and never tumble dried.",
      "Bonded nylon wipes clean with a damp cloth.",
    ],
  },
  "/help/contact": {
    title: "Contact",
    lines: [
      "Write to studio@heft.example for orders, fit questions or press.",
      "We reply within one business day, Monday to Friday.",
    ],
  },
  "/privacy": {
    title: "Privacy",
    lines: [
      "We collect the details needed to fulfil your order and nothing else.",
      "You can request a copy or deletion of your data at any time.",
    ],
  },
  "/terms": {
    title: "Terms",
    lines: [
      "Prices are shown in USD and include duties for US deliveries.",
      "Goods remain property of HEFT until payment clears.",
    ],
  },
};
