import { useState } from "react";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import {
  formatPrice,
  getProduct,
  lookForProduct,
  lookPieces,
  relatedProducts,
  type Product,
} from "@/data/catalog";
import { ProductCard } from "@/components/ui/product-card";
import { QuietLink, ScreenHead } from "@/components/screen-head";
import { Link } from "@/router";
import { useCart } from "@/store/cart";
import { cx } from "@/lib/cx";

type ViewName = "Front" | "Back" | "On model";

export function ProductPage({ slug }: { slug: string }) {
  const product = getProduct(slug);
  if (!product) {
    return (
      <div className="px-[var(--gutter)] pt-[140px] pb-24">
        <h1 className="display">Piece not found</h1>
        <Link to="/collections/shop" className="pill pill--glass mt-6">
          Back to shop
        </Link>
      </div>
    );
  }
  return <ProductDetail key={product.slug} product={product} />;
}

function ProductDetail({ product }: { product: Product }) {
  const { add } = useCart();
  const modelLook = lookForProduct(product.slug);
  const [view, setView] = useState<ViewName>("Front");
  const [colour, setColour] = useState(product.colour);
  const [size, setSize] = useState(
    ["M", "32"].find(
      (preferred) =>
        product.sizes.includes(preferred) && !product.soldOut?.includes(preferred),
    ) ??
      product.sizes.find((entry) => !product.soldOut?.includes(entry)) ??
      "",
  );
  const [added, setAdded] = useState(false);
  const [unit, setUnit] = useState<"Inches" | "Cm">("Inches");

  const views: { name: ViewName; image: string }[] = [
    { name: "Front", image: product.image },
    ...(product.backImage ? [{ name: "Back" as ViewName, image: product.backImage }] : []),
    ...(modelLook ? [{ name: "On model" as ViewName, image: modelLook.image }] : []),
  ];
  const activeImage = views.find((entry) => entry.name === view)?.image ?? product.image;

  const measures = product.measures ?? [];
  const measureSize = size && product.measures?.some((row) => row.size === size) ? size : measures[0]?.size;
  const activeMeasures = measures.find((row) => row.size === measureSize);

  const toUnit = (value: string) => {
    if (unit === "Inches") return value;
    const number = Number.parseFloat(value);
    return Number.isNaN(number) ? value : `${(number * 2.54).toFixed(1)} cm`;
  };

  const details = [
    { label: "Fabric", value: product.fabric },
    { label: "Fit", value: product.fit },
    { label: "Made in", value: product.madeIn },
    { label: "Care", value: product.care },
    { label: "Sizes", value: product.sizeRange },
    { label: "Colour", value: colour },
  ];

  const related = relatedProducts(product);

  return (
    <div className="pb-10">
      <ScreenHead
        title={product.name}
        size="sm"
        hideTitle
        crumb={[
          { label: "Home", href: "/" },
          { label: "Shop", href: "/collections/shop" },
          { label: product.category, href: `/collections/${product.category.toLowerCase()}` },
          { label: product.name },
        ]}
        className="pt-[100px]"
      />

      <section aria-label={`${product.name} product`} className="px-[var(--gutter)] pt-6">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(340px,420px)] lg:gap-12">
          <div>
            <div className="stage-soft relative flex h-[clamp(380px,52vw,560px)] items-start justify-center pt-8">
              <span aria-hidden className="hanger" />
              <img
                src={activeImage}
                alt={`${product.name} in ${colour.toLowerCase()}`}
                className="h-full w-auto max-w-full object-contain drop-shadow-[0_18px_26px_rgba(12,18,24,0.1)]"
              />
            </div>

            <div className="mt-4 flex justify-center">
              <div className="seg" role="group" aria-label="Product views">
                {views.map((entry) => (
                  <button
                    key={entry.name}
                    type="button"
                    aria-pressed={view === entry.name}
                    onClick={() => setView(entry.name)}
                  >
                    {entry.name}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="surface h-fit rounded-[26px] p-[clamp(18px,2vw,26px)] lg:sticky lg:top-[92px]">
            <div className="flex items-start justify-between gap-4">
              <h2 className="text-[clamp(22px,2vw,30px)] font-medium leading-tight tracking-[-0.03em]">
                {product.name}
              </h2>
              <span className="whitespace-nowrap text-[17px] font-medium tabular-nums">
                {formatPrice(product.price)}
              </span>
            </div>
            <p className="mt-1 text-[12.5px] text-foreground/55">{product.fabric}</p>

            <div className="mt-5 border-t border-border pt-4">
              <div className="flex items-baseline justify-between">
                <span className="text-[12px] font-medium">Colour</span>
                <span className="text-[12px] text-foreground/55">{colour}</span>
              </div>
              <div className="mt-2.5 flex gap-2">
                {product.colourways.map((way) => (
                  <button
                    key={way.label}
                    type="button"
                    aria-label={way.label}
                    aria-pressed={colour === way.label}
                    onClick={() => setColour(way.label)}
                    className={cx(
                      "size-[26px] rounded-full border border-black/10 transition-shadow",
                      colour === way.label && "ring-1 ring-foreground ring-offset-[3px]",
                    )}
                    style={{ backgroundColor: way.hex }}
                  />
                ))}
              </div>
            </div>

            <div className="mt-5 border-t border-border pt-4">
              <div className="flex items-baseline justify-between">
                <span className="text-[12px] font-medium">Size</span>
                <Link
                  to="/help/size-guide"
                  className="inline-flex items-center gap-1 text-[12px] text-foreground/55 transition-colors hover:text-foreground"
                >
                  Size guide
                  <ArrowUpRight className="size-3" strokeWidth={1.8} />
                </Link>
              </div>
              <div className="mt-2.5 flex flex-wrap gap-1.5">
                {product.sizes.map((entry) => (
                  <button
                    key={entry}
                    type="button"
                    aria-pressed={size === entry}
                    disabled={product.soldOut?.includes(entry)}
                    onClick={() => setSize(entry)}
                    className="chip"
                  >
                    {entry}
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-5 border-t border-border pt-4">
              <p className="flex items-center gap-2 text-[12px]">
                <span aria-hidden className="size-1.5 rounded-full bg-[#3E6B4F]" />
                In stock
              </p>
              <p className="mt-1 text-[12px] text-foreground/55">Ships in 2–3 days</p>
            </div>

            <button
              type="button"
              onClick={() => {
                if (!size) return;
                add(product, size, colour);
                setAdded(true);
                window.setTimeout(() => setAdded(false), 1800);
              }}
              disabled={!size}
              className="pill pill--primary mt-4 h-11 w-full disabled:cursor-not-allowed disabled:opacity-40"
            >
              {added ? "Added to bag" : size ? "Add to bag" : "Select a size"}
            </button>

            <Link
              to="/help/shipping"
              className="mt-3 flex items-center justify-between border-t border-border pt-3 text-[12.5px] text-foreground/70 transition-colors hover:text-foreground"
            >
              Delivery and returns
              <ArrowRight className="size-4" strokeWidth={1.7} />
            </Link>
          </div>
        </div>
      </section>

      <section aria-labelledby="details-title" className="px-[var(--gutter)] pt-12">
        <h2 id="details-title" className="display-sm">
          Details
        </h2>
        <dl className="mt-4 grid gap-x-12 sm:grid-cols-2">
          {details.map((detail) => (
            <div key={detail.label} className="field-row">
              <dt className="text-[12.5px] text-foreground/55">{detail.label}</dt>
              <dd className="text-[13px]">{detail.value}</dd>
            </div>
          ))}
        </dl>
      </section>

      {measures.length > 0 && (
        <section aria-labelledby="fit-title" className="px-[var(--gutter)] pt-12">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <h2 id="fit-title" className="display-sm">
              Fit
            </h2>
            <div className="seg" role="group" aria-label="Measurement units">
              {(["Inches", "Cm"] as const).map((entry) => (
                <button
                  key={entry}
                  type="button"
                  aria-pressed={unit === entry}
                  onClick={() => setUnit(entry)}
                >
                  {entry}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-5 grid gap-6 sm:grid-cols-[160px_minmax(0,1fr)]">
            <div>
              <p className="text-[12px] text-foreground/50">Size</p>
              <p className="mt-1 text-[22px] font-medium tabular-nums">{measureSize}</p>
            </div>
            <dl className="grid grid-cols-2 gap-x-8 sm:grid-cols-4">
              {activeMeasures &&
                [
                  { label: "Waist", value: activeMeasures.waist },
                  { label: "Rise", value: activeMeasures.rise },
                  { label: "Inseam", value: activeMeasures.inseam },
                  { label: "Leg opening", value: activeMeasures.opening },
                ].map((measure) => (
                  <div key={measure.label} className="border-t border-border pt-2.5">
                    <dt className="text-[11.5px] text-foreground/50">{measure.label}</dt>
                    <dd className="mt-0.5 text-[13.5px] tabular-nums">
                      {toUnit(measure.value)}
                    </dd>
                  </div>
                ))}
            </dl>
          </div>

          <div className="mt-8 overflow-x-auto">
            <div className="flex items-baseline justify-between gap-4">
              <h3 className="text-[15px] font-medium">All sizes</h3>
              <p className="text-[12px] text-foreground/45">
                Measurements in {unit.toLowerCase()}
              </p>
            </div>
            <table className="mt-3 w-full min-w-[520px] border-collapse text-left text-[12.5px]">
              <thead>
                <tr className="border-y border-border text-[11px] uppercase tracking-[0.12em] text-foreground/45">
                  <th scope="col" className="py-2.5 pr-4 font-medium">
                    Size
                  </th>
                  <th scope="col" className="py-2.5 pr-4 font-medium">
                    Waist
                  </th>
                  <th scope="col" className="py-2.5 pr-4 font-medium">
                    Rise
                  </th>
                  <th scope="col" className="py-2.5 pr-4 font-medium">
                    Inseam
                  </th>
                  <th scope="col" className="py-2.5 font-medium">
                    Leg opening
                  </th>
                </tr>
              </thead>
              <tbody>
                {measures.map((row) => (
                  <tr
                    key={row.size}
                    className={cx(
                      "border-b border-border tabular-nums",
                      row.size === measureSize && "bg-white/60",
                    )}
                  >
                    <th scope="row" className="py-2.5 pr-4 font-medium">
                      {row.size}
                    </th>
                    <td className="py-2.5 pr-4">{toUnit(row.waist)}</td>
                    <td className="py-2.5 pr-4">{toUnit(row.rise)}</td>
                    <td className="py-2.5 pr-4">{toUnit(row.inseam)}</td>
                    <td className="py-2.5">{toUnit(row.opening)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {modelLook && (
        <section aria-labelledby="worn-title" className="px-[var(--gutter)] pt-12">
          <div className="mb-4 flex items-baseline justify-between gap-6">
            <h2 id="worn-title" className="display-sm">
              Worn in
            </h2>
            <QuietLink to="/lookbook">All 4 looks</QuietLink>
          </div>

          <div className="surface flex flex-col items-start gap-6 rounded-[26px] p-[clamp(16px,2vw,26px)] sm:flex-row sm:items-center">
            <div className="stage-soft grid h-[190px] w-full shrink-0 place-items-end justify-center sm:w-[150px]">
              <img
                src={modelLook.image}
                alt={modelLook.alt}
                loading="lazy"
                className="h-full w-auto object-contain"
              />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-[15px] font-medium">{modelLook.name}</p>
              <p className="mt-1 text-[12px] text-foreground/55">{modelLook.pieces.length} pieces</p>
              <ul className="mt-3 flex flex-wrap gap-2">
                {lookPieces(modelLook).map((piece) => (
                  <li key={piece.slug}>
                    <Link
                      to={`/products/${piece.slug}`}
                      className="flex items-center gap-2 rounded-xl border border-border bg-white/70 p-1.5 pr-3 text-[12px] transition-colors hover:border-foreground/20"
                    >
                      <span className="grid size-8 place-items-center rounded-lg bg-secondary/70">
                        <img src={piece.image} alt="" className="h-6 w-auto object-contain" />
                      </span>
                      {piece.name}
                      <span className="tabular-nums text-foreground/50">
                        {formatPrice(piece.price)}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div className="flex w-full items-center justify-between gap-4 sm:w-auto sm:flex-col sm:items-end">
              <span className="text-[15px] font-medium tabular-nums">
                {formatPrice(modelLook.price)}
              </span>
              <Link to={`/looks/${modelLook.slug}`} className="pill pill--glass h-10">
                View look
                <ArrowRight className="size-4" strokeWidth={1.7} />
              </Link>
            </div>
          </div>
        </section>
      )}

      <section aria-labelledby="related-title" className="px-[var(--gutter)] pt-12">
        <div className="mb-5 flex items-baseline justify-between gap-6">
          <h2 id="related-title" className="display-sm">
            Related pieces
          </h2>
          <QuietLink to={`/collections/${product.category.toLowerCase()}`}>
            All {product.category.toLowerCase()}
          </QuietLink>
        </div>
        <div className="grid grid-cols-2 gap-x-3 gap-y-6 sm:grid-cols-3 lg:grid-cols-4">
          {related.map((piece) => (
            <ProductCard key={piece.slug} product={piece} />
          ))}
        </div>
      </section>
    </div>
  );
}
