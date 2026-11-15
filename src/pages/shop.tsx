import { useEffect, useMemo, useState } from "react";
import { ArrowRight, Check, ChevronDown } from "lucide-react";
import {
  categories,
  colourFilters,
  priceBands,
  products,
  type Category,
} from "@/data/catalog";
import { ProductCard } from "@/components/ui/product-card";
import { QuietLink, ScreenHead } from "@/components/screen-head";
import { cx } from "@/lib/cx";

type SortKey = "featured" | "price-asc" | "price-desc";

const SIZES = ["XS", "S", "M", "L", "XL", "XXL"];
const DENIM_SIZES = ["28", "30", "32", "34"];

export function ShopPage({ category }: { category?: string }) {
  const initial = categories.find(
    (entry) => entry.label.toLowerCase() === (category ?? "").toLowerCase(),
  )?.label;

  const [activeCategories, setActiveCategories] = useState<Category[]>(initial ? [initial] : []);
  const [activeSizes, setActiveSizes] = useState<string[]>([]);
  const [activeColours, setActiveColours] = useState<string[]>([]);
  const [priceBand, setPriceBand] = useState<string | null>(null);
  const [sort, setSort] = useState<SortKey>("featured");

  useEffect(() => {
    setActiveCategories(initial ? [initial] : []);
  }, [initial]);

  const filtered = useMemo(() => {
    const band = priceBands.find((entry) => entry.id === priceBand);
    const list = products.filter((product) => {
      const matchesCategory =
        activeCategories.length === 0 || activeCategories.includes(product.category);
      const matchesSize =
        activeSizes.length === 0 || activeSizes.some((size) => product.sizes.includes(size));
      const matchesColour =
        activeColours.length === 0 ||
        activeColours.some((colour) => product.colourways.some((way) => way.label === colour));
      const matchesPrice = !band || (product.price >= band.min && product.price <= band.max);
      return matchesCategory && matchesSize && matchesColour && matchesPrice;
    });

    if (sort === "price-asc") return [...list].sort((a, b) => a.price - b.price);
    if (sort === "price-desc") return [...list].sort((a, b) => b.price - a.price);
    return list;
  }, [activeCategories, activeSizes, activeColours, priceBand, sort]);

  const toggle = <T,>(list: T[], value: T) =>
    list.includes(value) ? list.filter((entry) => entry !== value) : [...list, value];

  const hasFilters =
    activeCategories.length > 0 ||
    activeSizes.length > 0 ||
    activeColours.length > 0 ||
    priceBand !== null;

  const clearAll = () => {
    setActiveCategories([]);
    setActiveSizes([]);
    setActiveColours([]);
    setPriceBand(null);
  };

  const shownSizes = activeCategories.length === 0 || activeCategories.includes("Denim")
    ? [...SIZES, ...DENIM_SIZES]
    : SIZES;

  return (
    <div className="pb-10">
      <ScreenHead
        title="Shop"
        meta={`${products.length} pieces`}
        crumb={[{ label: "Home", href: "/" }, { label: "Shop" }]}
        action={<QuietLink to="/lookbook">Shop the looks</QuietLink>}
      />

      <section aria-label="Product listing" className="px-[var(--gutter)] pt-6">
        <div className="surface p-[clamp(16px,2.4vw,28px)]">
          <div className="grid gap-8 lg:grid-cols-[minmax(0,260px)_minmax(0,1fr)] lg:gap-10">
            <form
              aria-label="Filters"
              className="lg:border-r lg:border-border lg:pr-8"
              onSubmit={(event) => event.preventDefault()}
            >
              <div className="flex items-center justify-between border-b border-border pb-3">
                <h2 className="text-[13.5px] font-medium">Filters</h2>
                <button
                  type="button"
                  onClick={clearAll}
                  disabled={!hasFilters}
                  className="text-[12.5px] text-foreground/50 transition-colors hover:text-foreground disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Clear all
                </button>
              </div>

              <fieldset className="border-b border-border py-4">
                <legend className="mb-1 text-[12.5px] font-medium">Category</legend>
                {categories.map((entry) => {
                  const checked = activeCategories.includes(entry.label);
                  return (
                    <label
                      key={entry.label}
                      className="flex cursor-pointer items-center gap-2.5 py-1.5 text-[13px]"
                    >
                      <input
                        type="checkbox"
                        className="peer sr-only"
                        checked={checked}
                        onChange={() => setActiveCategories(toggle(activeCategories, entry.label))}
                      />
                      <span
                        aria-hidden
                        className="grid size-4 shrink-0 place-items-center rounded-[4px] border border-border bg-white peer-checked:border-foreground peer-checked:bg-foreground peer-focus-visible:ring-2 peer-focus-visible:ring-ring"
                      >
                        {checked && (
                          <Check className="size-3 text-primary-foreground" strokeWidth={3} />
                        )}
                      </span>
                      <span className="flex-1">{entry.label}</span>
                      <span className="tabular-nums text-foreground/40">{entry.count}</span>
                    </label>
                  );
                })}
              </fieldset>

              <fieldset className="border-b border-border py-4">
                <legend className="mb-2.5 text-[12.5px] font-medium">Size</legend>
                <div className="flex flex-wrap gap-1.5">
                  {shownSizes.map((size) => (
                    <button
                      key={size}
                      type="button"
                      aria-pressed={activeSizes.includes(size)}
                      onClick={() => setActiveSizes(toggle(activeSizes, size))}
                      className="chip h-8 min-w-0 px-2.5 text-[11.5px]"
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </fieldset>

              <fieldset className="border-b border-border py-4">
                <legend className="mb-2.5 text-[12.5px] font-medium">Colour</legend>
                <div className="flex flex-wrap gap-2">
                  {colourFilters.map((colour) => {
                    const pressed = activeColours.includes(colour.label);
                    return (
                      <button
                        key={colour.label}
                        type="button"
                        aria-label={colour.label}
                        aria-pressed={pressed}
                        onClick={() => setActiveColours(toggle(activeColours, colour.label))}
                        className={cx(
                          "size-6 rounded-full border border-black/10 transition-shadow",
                          pressed && "ring-1 ring-foreground ring-offset-2",
                        )}
                        style={{ backgroundColor: colour.hex }}
                      />
                    );
                  })}
                </div>
              </fieldset>

              <fieldset className="py-4">
                <legend className="mb-1 text-[12.5px] font-medium">Price</legend>
                {priceBands.map((band) => (
                  <label
                    key={band.id}
                    className="flex cursor-pointer items-center gap-2.5 py-1.5 text-[13px]"
                  >
                    <input
                      type="radio"
                      name="price"
                      className="peer sr-only"
                      checked={priceBand === band.id}
                      onChange={() => setPriceBand(priceBand === band.id ? null : band.id)}
                    />
                    <span
                      aria-hidden
                      className="size-4 shrink-0 rounded-full border border-border bg-white peer-checked:border-[5px] peer-checked:border-foreground peer-focus-visible:ring-2 peer-focus-visible:ring-ring"
                    />
                    <span>{band.label}</span>
                  </label>
                ))}
              </fieldset>
            </form>

            <div>
              <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
                <p className="text-[12.5px] tabular-nums text-foreground/55">
                  {filtered.length} results
                </p>
                <div className="relative">
                  <select
                    aria-label="Sort products"
                    value={sort}
                    onChange={(event) => setSort(event.target.value as SortKey)}
                    className="h-9 appearance-none rounded-xl border border-border bg-white/85 pl-3 pr-8 text-[12.5px] font-medium outline-none"
                  >
                    <option value="featured">Featured</option>
                    <option value="price-asc">Price, low to high</option>
                    <option value="price-desc">Price, high to low</option>
                  </select>
                  <ChevronDown
                    aria-hidden
                    className="pointer-events-none absolute right-2.5 top-1/2 size-3.5 -translate-y-1/2 text-foreground/50"
                    strokeWidth={1.8}
                  />
                </div>
              </div>

              {filtered.length > 0 ? (
                <div className="product-grid">
                  {filtered.map((product) => (
                    <ProductCard key={product.slug} product={product} showSizes />
                  ))}
                </div>
              ) : (
                <div className="flex min-h-[320px] flex-col items-center justify-center gap-3 text-center">
                  <p className="text-[14px] font-medium">No pieces match these filters</p>
                  <button
                    type="button"
                    onClick={clearAll}
                    className="text-[13px] text-foreground/60 underline underline-offset-4"
                  >
                    Clear all filters
                  </button>
                </div>
              )}

              <div className="mt-8 flex flex-col items-center gap-2">
                <button type="button" onClick={clearAll} className="pill pill--glass">
                  View all {products.length} pieces
                  <ArrowRight className="size-4" strokeWidth={1.7} />
                </button>
                <p className="text-[11.5px] text-foreground/40">
                  Showing {filtered.length} of {products.length}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
