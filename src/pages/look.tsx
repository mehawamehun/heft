import { useState } from "react";
import { ArrowUpRight, Check } from "lucide-react";
import {
  formatPrice,
  getLook,
  lookPieces,
  looks,
  type Look,
  type Product,
} from "@/data/catalog";
import { QuietLink, ScreenHead } from "@/components/screen-head";
import { Link } from "@/router";
import { useCart } from "@/store/cart";
import { cx } from "@/lib/cx";

const defaultSize = (piece: Product) =>
  piece.sizes.find((size) => size === "M") ??
  piece.sizes.find((size) => size === "32") ??
  piece.sizes[0];

export function LookPage({ slug }: { slug: string }) {
  const look = getLook(slug);
  if (!look) {
    return (
      <div className="px-[var(--gutter)] pb-24 pt-[140px]">
        <h1 className="display">Look not found</h1>
        <Link to="/lookbook" className="pill pill--glass mt-6">
          Back to lookbook
        </Link>
      </div>
    );
  }
  return <LookDetail key={look.slug} look={look} />;
}

function LookDetail({ look }: { look: Look }) {
  const { add } = useCart();
  const pieces = lookPieces(look);
  const [selected, setSelected] = useState<string[]>(pieces.map((piece) => piece.slug));
  const [sizes, setSizes] = useState<Record<string, string>>(() =>
    Object.fromEntries(pieces.map((piece) => [piece.slug, defaultSize(piece)])),
  );
  const [added, setAdded] = useState(false);

  const selectedPieces = pieces.filter((piece) => selected.includes(piece.slug));
  const selectedTotal = selectedPieces.reduce((sum, piece) => sum + piece.price, 0);

  const related = looks.filter((entry) => entry.slug !== look.slug).slice(0, 2);

  return (
    <div className="pb-10">
      <ScreenHead
        title={look.name}
        size="sm"
        hideTitle
        className="pt-[100px]"
        crumb={[
          { label: "Home", href: "/" },
          { label: "Lookbook", href: "/lookbook" },
          { label: look.name },
        ]}
      />

      <section aria-label={`${look.name} look`} className="px-[var(--gutter)] pt-6">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(330px,430px)] lg:gap-12">
          <div>
            <div className="stage-soft relative flex h-[clamp(420px,58vw,680px)] items-end justify-center">
              <img
                src={look.image}
                alt={look.alt}
                className="h-full w-auto max-w-full object-contain"
              />
            </div>
            <div className="mt-2 flex flex-wrap items-center justify-between gap-3 border-t border-border pt-3">
              <div className="flex flex-wrap gap-4">
                {pieces.map((piece) => (
                  <Link
                    key={piece.slug}
                    to={`/products/${piece.slug}`}
                    className="inline-flex items-center gap-1 text-[12px] text-foreground/70 transition-colors hover:text-foreground"
                  >
                    {piece.name}
                    <ArrowUpRight className="size-3" strokeWidth={1.8} />
                  </Link>
                ))}
              </div>
              <p className="text-[11.5px] text-foreground/45">{look.modelNote}</p>
            </div>
          </div>

          <div>
            <div className="surface rounded-[26px] p-[clamp(16px,2vw,24px)]">
              <div className="flex items-start justify-between gap-4">
                <h2 className="text-[clamp(22px,2vw,28px)] font-medium leading-tight tracking-[-0.03em]">
                  {look.name}
                </h2>
              </div>
              <p className="mt-1.5 flex items-baseline gap-2.5 text-[13px]">
                <span className="font-medium tabular-nums">{formatPrice(look.price)}</span>
                <span className="text-foreground/55">{pieces.length} pieces</span>
              </p>

              <ul className="mt-4">
                {pieces.map((piece) => {
                  const isSelected = selected.includes(piece.slug);
                  return (
                    <li key={piece.slug} className="border-t border-border py-3">
                      <div className="flex items-start gap-3">
                        <button
                          type="button"
                          role="checkbox"
                          aria-checked={isSelected}
                          aria-label={`Include ${piece.name}`}
                          onClick={() =>
                            setSelected((current) =>
                              current.includes(piece.slug)
                                ? current.filter((entry) => entry !== piece.slug)
                                : [...current, piece.slug],
                            )
                          }
                          className={cx(
                            "mt-1 grid size-4 shrink-0 place-items-center rounded-[4px] border transition-colors",
                            isSelected
                              ? "border-foreground bg-foreground text-primary-foreground"
                              : "border-border bg-white",
                          )}
                        >
                          {isSelected && <Check className="size-3" strokeWidth={3} />}
                        </button>
                        <span className="grid size-11 shrink-0 place-items-center rounded-lg bg-secondary/70">
                          <img src={piece.image} alt="" className="h-8 w-auto object-contain" />
                        </span>
                        <span className="min-w-0 flex-1">
                          <span className="block text-[13px] font-medium">{piece.name}</span>
                          <span className="mt-0.5 block text-[11.5px] text-foreground/55">
                            {piece.colour}
                          </span>
                        </span>
                        <span className="text-[13px] tabular-nums">{formatPrice(piece.price)}</span>
                      </div>

                      <div className="mt-2 flex flex-wrap gap-1.5 pl-[60px]">
                        {piece.sizes.map((size) => (
                          <button
                            key={size}
                            type="button"
                            aria-pressed={sizes[piece.slug] === size}
                            disabled={piece.soldOut?.includes(size)}
                            onClick={() =>
                              setSizes((current) => ({ ...current, [piece.slug]: size }))
                            }
                            className="chip h-7 min-w-[34px] px-2 text-[11px]"
                          >
                            {size}
                          </button>
                        ))}
                      </div>
                    </li>
                  );
                })}
              </ul>

              <div className="flex items-baseline justify-between border-t border-border pt-3.5">
                <span className="text-[12.5px] text-foreground/55">
                  {selectedPieces.length} pieces selected
                </span>
                <span className="text-[15px] font-medium tabular-nums">
                  {formatPrice(selectedTotal)}
                </span>
              </div>

              <button
                type="button"
                disabled={selectedPieces.length === 0}
                onClick={() => {
                  selectedPieces.forEach((piece) =>
                    add(piece, sizes[piece.slug], piece.colour),
                  );
                  setAdded(true);
                  window.setTimeout(() => setAdded(false), 1800);
                }}
                className="pill pill--primary mt-3 h-11 w-full disabled:cursor-not-allowed disabled:opacity-40"
              >
                {added ? "Added to bag" : "Add selected pieces"}
              </button>

              <div className="mt-3 flex items-center justify-between text-[11.5px] text-foreground/55">
                <Link to="/help/size-guide" className="inline-flex items-center gap-1">
                  Size guide
                  <ArrowUpRight className="size-3" strokeWidth={1.8} />
                </Link>
                <Link to="/help/shipping" className="inline-flex items-center gap-1">
                  Delivery and returns
                  <ArrowUpRight className="size-3" strokeWidth={1.8} />
                </Link>
              </div>
            </div>

            <dl className="mt-4 text-[12px]">
              {[
                { label: "Delivery", value: "Free over $150, arrives in 2–3 business days" },
                { label: "Returns", value: "Within 30 days of delivery" },
                { label: "Payment", value: "Card, Apple Pay, PayPal" },
              ].map((row) => (
                <div
                  key={row.label}
                  className="grid grid-cols-[96px_minmax(0,1fr)] gap-4 border-t border-border py-2.5"
                >
                  <dt className="text-[10px] uppercase tracking-[0.14em] text-foreground/40">
                    {row.label}
                  </dt>
                  <dd className="text-foreground/70">{row.value}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </section>

      <section aria-labelledby="composition-title" className="px-[var(--gutter)] pt-12">
        <h2 id="composition-title" className="display-sm">
          Composition
        </h2>
        <div className="mt-4 grid gap-x-12 sm:grid-cols-2">
          {pieces.map((piece) => (
            <div key={piece.slug} className="border-t border-border py-3">
              <div className="grid grid-cols-[minmax(0,1fr)_minmax(0,1.5fr)] gap-4">
                <p className="text-[13px] font-medium">{piece.name}</p>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-[10px] uppercase tracking-[0.14em] text-foreground/40">
                      Fabric
                    </p>
                    <p className="mt-0.5 text-[12.5px] text-foreground/70">{piece.fabric}</p>
                  </div>
                  <div>
                    <p className="text-[10px] uppercase tracking-[0.14em] text-foreground/40">
                      Sizes
                    </p>
                    <p className="mt-0.5 text-[12.5px] text-foreground/70">{piece.sizeRange}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}

          <div className="border-t border-border py-3">
            <div className="grid grid-cols-[minmax(0,1fr)_minmax(0,1.5fr)] gap-4">
              <p className="text-[13px] font-medium">Colourway</p>
              <div className="grid grid-cols-2 gap-4">
                {pieces.map((piece) => (
                  <div key={piece.slug}>
                    <p className="text-[10px] uppercase tracking-[0.14em] text-foreground/40">
                      {piece.category}
                    </p>
                    <p className="mt-0.5 text-[12.5px] text-foreground/70">{piece.colour}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="border-t border-border py-3">
            <div className="grid grid-cols-[minmax(0,1fr)_minmax(0,1.5fr)] gap-4">
              <p className="text-[13px] font-medium">Care</p>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-[10px] uppercase tracking-[0.14em] text-foreground/40">
                    Wash
                  </p>
                  <p className="mt-0.5 text-[12.5px] text-foreground/70">
                    Cold, inside out
                  </p>
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-[0.14em] text-foreground/40">
                    Dry
                  </p>
                  <p className="mt-0.5 text-[12.5px] text-foreground/70">Line dry</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section aria-labelledby="related-looks-title" className="px-[var(--gutter)] pt-12">
        <div className="mb-5 flex items-baseline justify-between gap-6">
          <h2 id="related-looks-title" className="display-sm">
            Related looks
          </h2>
          <QuietLink to="/lookbook">All 4 looks</QuietLink>
        </div>
        <div className="grid gap-5 sm:grid-cols-2">
          {related.map((entry) => (
            <Link key={entry.slug} to={`/looks/${entry.slug}`} className="block">
              <div className="stage-soft flex h-[300px] items-end justify-center">
                <img
                  src={entry.image}
                  alt={entry.alt}
                  loading="lazy"
                  className="h-full w-auto object-contain"
                />
              </div>
              <div className="flex items-start justify-between gap-3 border-t border-border pt-3">
                <div>
                  <p className="text-[13.5px] font-medium">{entry.name}</p>
                  <p className="mt-1 text-[11.5px] leading-[1.45] text-foreground/55">
                    {lookPieces(entry)
                      .map((piece) => piece.name)
                      .join(", ")}
                  </p>
                  <p className="mt-1.5 inline-flex items-center gap-1 text-[12px] font-medium">
                    View look
                    <ArrowUpRight className="size-3.5" strokeWidth={1.8} />
                  </p>
                </div>
                <span className="text-[13.5px] font-medium tabular-nums">
                  {formatPrice(entry.price)}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
