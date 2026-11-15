import { useMemo, useState } from "react";
import { ArrowRight, Search, X } from "lucide-react";
import { formatPrice, getLook, lookbookLooks, products } from "@/data/catalog";
import { Link, useRouter } from "@/router";
import { cx } from "@/lib/cx";

type Tab = "All" | "Pieces" | "Looks";

const looks = lookbookLooks
  .map((slug) => getLook(slug))
  .filter((look): look is NonNullable<ReturnType<typeof getLook>> => Boolean(look));

export function SearchPage() {
  const { navigate } = useRouter();
  const [query, setQuery] = useState("");
  const [tab, setTab] = useState<Tab>("All");

  const needle = query.trim().toLowerCase();

  const pieceMatches = useMemo(
    () =>
      products.filter((product) =>
        `${product.name} ${product.spec} ${product.category}`.toLowerCase().includes(needle),
      ),
    [needle],
  );

  const lookMatches = useMemo(
    () =>
      looks.filter((look) =>
        `${look.name} ${look.pieces.join(" ")}`.toLowerCase().includes(needle),
      ),
    [needle],
  );

  const showPieces = tab !== "Looks" && pieceMatches.length > 0;
  const showLooks = tab !== "Pieces" && lookMatches.length > 0;

  return (
    <div className="fixed inset-0 z-90 flex items-start justify-center bg-foreground/35 px-4 pt-[104px] backdrop-blur-[3px] sm:items-center sm:pt-0">
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Search the store"
        className="surface relative w-full max-w-[760px] rounded-[24px] p-4 sm:p-6"
      >
        <button
          type="button"
          aria-label="Close search"
          onClick={() => {
            if (window.history.length > 1) {
              window.history.back();
            } else {
              navigate("/");
            }
          }}
          className="glass absolute -left-1.5 -top-1.5 z-10 grid size-9 place-items-center rounded-full text-foreground/70"
        >
          <X className="size-4" strokeWidth={1.8} />
        </button>

        <div className="relative">
          <Search
            aria-hidden
            className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-foreground/45"
            strokeWidth={1.8}
          />
          <input
            autoFocus
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search pieces and looks"
            aria-label="Search pieces and looks"
            className="field h-12 rounded-full pl-11 pr-11 text-[14px] [&::-webkit-search-cancel-button]:hidden"
          />
          {query && (
            <button
              type="button"
              aria-label="Clear search"
              onClick={() => setQuery("")}
              className="absolute right-3.5 top-1/2 grid size-6 -translate-y-1/2 place-items-center rounded-full bg-foreground/10 text-foreground/60"
            >
              <X className="size-3" strokeWidth={2.2} />
            </button>
          )}
        </div>

        <div role="tablist" aria-label="Result types" className="seg mt-3.5">
          {(["All", "Pieces", "Looks"] as Tab[]).map((entry) => (
            <button
              key={entry}
              type="button"
              role="tab"
              aria-selected={tab === entry}
              aria-pressed={tab === entry}
              onClick={() => setTab(entry)}
            >
              {entry}
            </button>
          ))}
        </div>

        <div className="mt-4 max-h-[min(520px,52vh)] overflow-y-auto pr-1">
          {showPieces && (
            <section aria-labelledby="search-pieces">
              <div className="flex items-baseline justify-between px-1 pb-1 pt-3">
                <h2 id="search-pieces" className="text-[12px] font-medium text-foreground/70">
                  Pieces
                </h2>
                <span className="text-[12px] tabular-nums text-foreground/35">
                  {pieceMatches.length}
                </span>
              </div>
              <ul>
                {pieceMatches.map((product) => (
                  <li key={product.slug}>
                    <Link
                      to={`/products/${product.slug}`}
                      className="flex items-center gap-3 rounded-xl px-1 py-2 hover:bg-white/60"
                    >
                      <span className="grid size-11 shrink-0 place-items-center rounded-lg bg-secondary/70">
                        <img
                          src={product.image}
                          alt=""
                          loading="lazy"
                          className="h-8 w-auto object-contain"
                        />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-[13px] font-medium">
                          {product.name}
                        </span>
                        <span className="mt-0.5 block truncate text-[11.5px] text-foreground/50">
                          {product.category}, {product.colour}
                        </span>
                      </span>
                      <span className="text-[12.5px] tabular-nums">
                        {formatPrice(product.price)}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {showLooks && (
            <section aria-labelledby="search-looks">
              <div className="flex items-baseline justify-between px-1 pb-1 pt-3">
                <h2 id="search-looks" className="text-[12px] font-medium text-foreground/70">
                  Looks
                </h2>
                <span className="text-[12px] tabular-nums text-foreground/35">
                  {lookMatches.length}
                </span>
              </div>
              <ul>
                {lookMatches.map((look) => (
                  <li key={look.slug}>
                    <Link
                      to={`/looks/${look.slug}`}
                      className="flex items-center gap-3 rounded-xl px-1 py-2 hover:bg-white/60"
                    >
                      <span className="stage-soft grid size-11 shrink-0 place-items-center rounded-lg">
                        <img
                          src={look.image}
                          alt=""
                          loading="lazy"
                          className="h-9 w-auto object-contain"
                        />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-[13px] font-medium">{look.name}</span>
                        <span className="mt-0.5 block text-[11.5px] text-foreground/50">
                          Look, {look.pieces.length} pieces
                        </span>
                      </span>
                      <span className="text-[12.5px] tabular-nums">
                        {formatPrice(look.price)}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {!showPieces && !showLooks && (
            <p className="px-1 py-10 text-center text-[13px] text-foreground/50">
              No matches for “{query}”
            </p>
          )}
        </div>

        <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-border pt-4">
          <p className={cx("flex gap-4 text-[11.5px] text-foreground/40")}>
            <span>{products.length} pieces</span>
            <span>{looks.length} looks</span>
          </p>
          <Link to="/collections/shop" className="pill pill--glass h-10">
            View all results
            <ArrowRight className="size-4" strokeWidth={1.7} />
          </Link>
        </div>
      </div>
    </div>
  );
}
