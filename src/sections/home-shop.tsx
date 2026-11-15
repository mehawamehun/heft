import { useState } from "react";
import { ArrowRight } from "lucide-react";
import { categories, products, type Category } from "@/data/catalog";
import { ProductCard } from "@/components/ui/product-card";
import { Link } from "@/router";

const filters: (Category | "All")[] = [
  "All",
  ...categories.filter((category) => category.label !== "Shirts").map((category) => category.label),
];

export function HomeShop() {
  const [active, setActive] = useState<Category | "All">("All");
  const visible = active === "All" ? products : products.filter((item) => item.category === active);

  return (
    <section
      aria-labelledby="home-shop-title"
      id="shop"
      className="scroll-mt-[100px] px-[var(--gutter)] pt-7"
    >
      <div className="surface p-[clamp(20px,2.6vw,34px)]">
        <div className="mb-6 flex flex-wrap items-end justify-between gap-6">
          <h2 id="home-shop-title" className="display-sm">
            Shop
          </h2>
          <div
            role="group"
            aria-label="Filter by category"
            className="seg max-w-full overflow-x-auto"
          >
            {filters.map((filter) => (
              <button
                key={filter}
                type="button"
                aria-pressed={active === filter}
                onClick={() => setActive(filter)}
                className="whitespace-nowrap"
              >
                {filter}
              </button>
            ))}
          </div>
        </div>

        <div className="product-grid">
          {visible.map((product) => (
            <ProductCard key={product.slug} product={product} />
          ))}
        </div>

        <div className="mt-8 flex justify-center">
          <Link to="/collections/shop" className="pill pill--glass">
            All {products.length} pieces
            <ArrowRight className="size-4" strokeWidth={1.7} />
          </Link>
        </div>
      </div>
    </section>
  );
}
