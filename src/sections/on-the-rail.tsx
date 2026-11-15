import { formatPrice, products } from "@/data/catalog";
import { Link } from "@/router";

const railSlugs = [
  "heavyweight-fleece-hoodie",
  "technical-field-jacket",
  "wide-leg-jean-indigo",
  "sherpa-fleece-jacket",
  "cropped-technical-bomber",
  "raglan-sweatshirt",
  "cargo-wide-pant",
  "striped-long-sleeve",
];

const railProducts = railSlugs
  .map((slug) => products.find((product) => product.slug === slug))
  .filter((product): product is (typeof products)[number] => Boolean(product));

export function OnTheRail() {
  return (
    <section aria-labelledby="rail-title" className="px-[var(--gutter)] pt-6">
      <div className="surface p-[clamp(20px,2.6vw,34px)] pb-[clamp(14px,1.8vw,24px)]">
        <div className="mb-6 flex items-baseline justify-between gap-6">
          <h2 id="rail-title" className="display-sm">
            On the rail
          </h2>
          <p className="text-[12.5px] tabular-nums text-foreground/55">
            {railProducts.length} of {products.length} pieces
          </p>
        </div>

        <div className="relative pt-2.5">
          <div aria-hidden className="rail-line">
            <span className="rail-cap left-0" />
            <span className="rail-cap right-0" />
          </div>

          <div className="relative z-10 flex flex-wrap justify-between gap-x-2 gap-y-6 lg:flex-nowrap">
            {railProducts.map((product) => (
              <Link
                key={product.slug}
                to={`/products/${product.slug}`}
                className="min-w-0 flex-[0_0_calc(50%-4px)] lg:flex-1 lg:basis-0"
              >
                <div className="flex h-[190px] items-start justify-center">
                  <img
                    src={product.image}
                    alt={`${product.name} in ${product.colour.toLowerCase()} on a hanger`}
                    loading="lazy"
                    decoding="async"
                    className="h-full w-full object-contain drop-shadow-[0_8px_10px_rgba(12,18,24,0.06)]"
                  />
                </div>
                <div className="mt-2.5 border-t border-border pt-2">
                  <p className="text-[10px] uppercase tracking-[0.16em] text-foreground/40">
                    {product.category}
                  </p>
                  <p className="mt-0.5 text-[12.5px] font-medium leading-[1.3]">{product.name}</p>
                  <p className="mt-0.5 text-[12px] tabular-nums text-foreground/70">
                    {formatPrice(product.price)}
                  </p>
                  <p className="mt-0.5 text-[11px] leading-[1.35] text-foreground/55">
                    {product.fabric}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
