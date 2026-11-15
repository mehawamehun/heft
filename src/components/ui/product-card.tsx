import { formatPrice, type Product } from "@/data/catalog";
import { Link } from "@/router";

export function ProductCard({
  product,
  showSizes = false,
}: {
  product: Product;
  showSizes?: boolean;
}) {
  return (
    <article className="min-w-0">
      <Link to={`/products/${product.slug}`} className="block">
        <div className="relative flex h-[196px] items-start justify-center pt-5">
          <span aria-hidden className="hanger" />
          <img
            src={product.image}
            alt={`${product.name} in ${product.colour.toLowerCase()} on a hanger`}
            loading="lazy"
            decoding="async"
            className="h-full w-auto max-w-full object-contain drop-shadow-[0_10px_14px_rgba(12,18,24,0.07)]"
          />
        </div>
        <div className="mt-2.5 flex items-start justify-between gap-2.5 border-t border-border pt-2.5">
          <div className="min-w-0">
            <h3 className="text-[15px] font-medium leading-[1.3] tracking-[-0.006em]">
              {product.name}
            </h3>
            <p className="mt-0.5 text-[13px] leading-[1.4] text-foreground/60">{product.spec}</p>
            {showSizes && (
              <p className="mt-1.5 flex flex-wrap gap-1.5 text-[10.5px] text-foreground/40">
                {product.sizes.map((size) => (
                  <span
                    key={size}
                    className={product.soldOut?.includes(size) ? "line-through" : undefined}
                  >
                    {size}
                  </span>
                ))}
              </p>
            )}
          </div>
          <span className="whitespace-nowrap text-[15px] font-medium tabular-nums">
            {formatPrice(product.price)}
          </span>
        </div>
      </Link>
    </article>
  );
}
