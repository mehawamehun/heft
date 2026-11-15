import { ArrowRight } from "lucide-react";
import { formatPrice, products } from "@/data/catalog";
import { ProductCard } from "@/components/ui/product-card";
import { QuantityStepper } from "@/components/ui/quantity-stepper";
import { QuietLink, ScreenHead } from "@/components/screen-head";
import { Link } from "@/router";
import { useCart } from "@/store/cart";

const relatedSlugs = [
  "sherpa-fleece-jacket",
  "raglan-sweatshirt",
  "striped-long-sleeve",
  "technical-field-jacket",
];

export function BagPage() {
  const { lines, itemCount, subtotal, delivery, tax, total, setQty, remove } = useCart();
  const related = products.filter((product) => relatedSlugs.includes(product.slug));

  return (
    <div className="pb-10">
      <ScreenHead
        title="Bag"
        meta={`${itemCount} ${itemCount === 1 ? "item" : "items"}`}
        action={<QuietLink to="/account">Orders</QuietLink>}
      />

      <section aria-label="Bag contents" className="px-[var(--gutter)] pt-7">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(320px,380px)] lg:items-start lg:gap-12">
          <div>
            {lines.length > 0 ? (
              <ul>
                {lines.map((line) => (
                  <li
                    key={line.key}
                    className="grid grid-cols-[80px_minmax(0,1fr)_auto] gap-4 border-b border-border py-5 first:pt-0"
                  >
                    <div className="grid h-20 place-items-center rounded-xl bg-white/60">
                      <img
                        src={line.image}
                        alt={line.name}
                        className="h-16 w-auto object-contain"
                      />
                    </div>
                    <div className="min-w-0">
                      <Link
                        to={`/products/${line.slug}`}
                        className="text-[13.5px] font-medium transition-colors hover:text-foreground/70"
                      >
                        {line.name}
                      </Link>
                      <p className="mt-1 text-[12px] text-foreground/55">
                        {line.colour} · Size {line.size}
                      </p>
                      <div className="mt-3 flex items-center gap-3">
                        <QuantityStepper
                          value={line.qty}
                          label={line.name}
                          onChange={(next) => setQty(line.key, next)}
                        />
                        <button
                          type="button"
                          onClick={() => remove(line.key)}
                          className="text-[12px] text-foreground/50 transition-colors hover:text-foreground"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                    <span className="text-[13.5px] font-medium tabular-nums">
                      {formatPrice(line.price * line.qty)}
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="surface rounded-[26px] p-10 text-center">
                <p className="text-[15px] font-medium">Your bag is empty</p>
                <p className="mt-1.5 text-[13px] text-foreground/55">
                  Pieces you add will be held here for the session.
                </p>
                <Link to="/collections/shop" className="pill pill--primary mt-5">
                  Shop the collection
                  <ArrowRight className="size-4" strokeWidth={1.7} />
                </Link>
              </div>
            )}
          </div>

          <aside className="surface h-fit rounded-[26px] p-[clamp(18px,2vw,24px)] lg:sticky lg:top-[92px]">
            <h2 className="text-[15px] font-medium">Summary</h2>
            <dl className="mt-4 space-y-2.5 text-[13px]">
              <div className="flex items-baseline justify-between">
                <dt>Subtotal</dt>
                <dd className="tabular-nums">{formatPrice(subtotal)}</dd>
              </div>
              <div>
                <div className="flex items-baseline justify-between">
                  <dt>Delivery</dt>
                  <dd className="tabular-nums">{delivery === 0 ? "Free" : formatPrice(delivery)}</dd>
                </div>
                <p className="mt-1 text-[11.5px] text-foreground/45">
                  Delivery is free over $250
                </p>
              </div>
              <div className="flex items-baseline justify-between">
                <dt>Estimated tax</dt>
                <dd className="tabular-nums">{formatPrice(tax)}</dd>
              </div>
            </dl>

            <div className="mt-3 flex items-baseline justify-between border-t border-border pt-3 text-[14px] font-medium">
              <span>Total</span>
              <span className="tabular-nums">{formatPrice(total)}</span>
            </div>

            <form
              className="mt-4"
              onSubmit={(event) => event.preventDefault()}
              aria-label="Discount code"
            >
              <label htmlFor="discount" className="text-[12px] text-foreground/55">
                Discount code
              </label>
              <div className="mt-1.5 flex gap-2">
                <input id="discount" className="field h-10 flex-1" placeholder="Enter code" />
                <button type="submit" className="pill pill--glass h-10 px-4 text-[12.5px]">
                  Apply
                </button>
              </div>
            </form>

            <Link
              to="/checkout"
              className="pill pill--primary mt-3.5 h-11 w-full disabled:pointer-events-none"
              aria-disabled={lines.length === 0}
            >
              Checkout
              <ArrowRight className="size-4" strokeWidth={1.7} />
            </Link>
            <Link
              to="/collections/shop"
              className="mt-2.5 block text-center text-[12.5px] text-foreground/60 transition-colors hover:text-foreground"
            >
              Continue shopping
            </Link>
          </aside>
        </div>
      </section>

      <section aria-labelledby="bag-related" className="px-[var(--gutter)] pt-14">
        <div className="mb-5 flex items-baseline justify-between gap-6">
          <h2 id="bag-related" className="display-sm">
            Related pieces
          </h2>
          <QuietLink to="/collections/shop">All pieces</QuietLink>
        </div>
        <div className="grid grid-cols-2 gap-x-3 gap-y-6 sm:grid-cols-3 lg:grid-cols-4">
          {related.map((product) => (
            <ProductCard key={product.slug} product={product} />
          ))}
        </div>
      </section>
    </div>
  );
}
