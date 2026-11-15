import { ArrowRight } from "lucide-react";
import { formatPrice, getLook, lookbookLooks, lookPieces, products } from "@/data/catalog";
import { ScreenHead } from "@/components/screen-head";
import { Link } from "@/router";
import { cx } from "@/lib/cx";

export function LookbookPage() {
  const looks = lookbookLooks
    .map((slug) => getLook(slug))
    .filter((look): look is NonNullable<ReturnType<typeof getLook>> => Boolean(look));

  return (
    <div className="pb-6">
      <ScreenHead
        title="Lookbook"
        crumb={[{ label: "Home", href: "/" }, { label: "Lookbook" }]}
        action={
          <div className="flex flex-wrap items-center gap-4 text-[12.5px] text-foreground/55">
            <span>Fall / Winter 26</span>
            <span aria-hidden className="h-3 w-px bg-border" />
            <span>{looks.length} looks</span>
            <Link
              to="/collections/shop"
              className="inline-flex items-center gap-1.5 font-medium text-foreground/75 transition-colors hover:text-foreground"
            >
              Shop all pieces
              <ArrowRight className="size-[15px]" strokeWidth={1.7} />
            </Link>
          </div>
        }
      />

      <div className="mt-8 border-t border-border">
        {looks.map((look, index) => {
          const pieces = lookPieces(look);
          const imageFirst = index % 2 === 0;

          return (
            <article
              key={look.slug}
              className="grid items-center gap-6 border-b border-border px-[var(--gutter)] py-[clamp(24px,3vw,40px)] lg:grid-cols-2 lg:gap-14"
            >
              <div className={cx("relative", imageFirst ? "lg:order-1" : "lg:order-2")}>
                <div className="stage-soft relative mx-auto flex h-[clamp(300px,33vw,460px)] w-full items-end justify-center">
                  <img
                    src={look.image}
                    alt={look.alt}
                    loading={index === 0 ? "eager" : "lazy"}
                    decoding="async"
                    className="h-full w-auto max-w-full object-contain"
                  />
                </div>
                <span
                  aria-hidden
                  className="absolute bottom-2 left-[14%] right-[14%] h-px bg-[linear-gradient(90deg,rgba(12,18,24,0),rgba(12,18,24,0.13),rgba(12,18,24,0))]"
                />
              </div>

              <div className={cx(imageFirst ? "lg:order-2" : "lg:order-1", "max-w-[520px]")}>
                <h2 className="text-[clamp(22px,2.1vw,30px)] font-medium tracking-[-0.03em]">
                  {look.name}
                </h2>
                <p className="mt-2 flex items-baseline gap-2.5 text-[13.5px]">
                  <span className="font-medium tabular-nums">{formatPrice(look.price)}</span>
                  <span className="text-foreground/55">{pieces.length} pieces</span>
                </p>

                <ul className="mt-5">
                  {pieces.map((piece) => (
                    <li key={piece.slug} className="border-t border-border last:border-b">
                      <Link
                        to={`/products/${piece.slug}`}
                        className="flex items-center gap-3.5 py-3"
                      >
                        <span className="grid size-14 shrink-0 place-items-center rounded-xl bg-secondary/70">
                          <img
                            src={piece.image}
                            alt=""
                            loading="lazy"
                            className="h-10 w-auto object-contain"
                          />
                        </span>
                        <span className="min-w-0 flex-1">
                          <span className="block text-[13.5px] font-medium">{piece.name}</span>
                          <span className="mt-0.5 block text-[11.5px] text-foreground/55">
                            {piece.spec}
                          </span>
                        </span>
                        <span className="text-[13px] font-medium tabular-nums">
                          {formatPrice(piece.price)}
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>

                <Link to={`/looks/${look.slug}`} className="pill pill--glass mt-5">
                  View look
                  <ArrowRight className="size-4" strokeWidth={1.7} />
                </Link>
              </div>
            </article>
          );
        })}
      </div>

      <p className="px-[var(--gutter)] pt-6 text-[12px] text-foreground/40">
        {products.length} pieces in the Fall / Winter 26 collection
      </p>
    </div>
  );
}
