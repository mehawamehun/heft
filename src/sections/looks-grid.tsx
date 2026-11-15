import { formatPrice, getLook, looks as allLooks, lookPieces } from "@/data/catalog";
import { QuietLink } from "@/components/screen-head";
import { Link } from "@/router";

const homeLooks = ["charcoal-fleece-hoodie", "olive-field-jacket", "cream-sweatshirt", "sherpa-and-denim"]
  .map((slug) => getLook(slug))
  .filter((look): look is NonNullable<ReturnType<typeof getLook>> => Boolean(look));

export function LooksGrid({ looks = homeLooks }: { looks?: typeof homeLooks }) {
  return (
    <section aria-labelledby="looks-title" className="px-[var(--gutter)] py-[clamp(40px,4.6vw,64px)]">
      <div className="mb-6 flex items-baseline justify-between gap-6">
        <h2 id="looks-title" className="display-sm">
          Looks
        </h2>
        <QuietLink to="/lookbook">All {allLooks.length} looks</QuietLink>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {looks.map((look) => (
          <Link key={look.slug} to={`/looks/${look.slug}`} className="block">
            <div className="stage-soft relative flex h-[330px] items-end justify-center">
              <img
                src={look.image}
                alt={look.alt}
                loading="lazy"
                decoding="async"
                className="h-full w-auto max-w-full object-contain"
              />
              <span
                aria-hidden
                className="absolute bottom-1.5 left-[12%] right-[12%] h-px bg-[linear-gradient(90deg,rgba(12,18,24,0),rgba(12,18,24,0.13),rgba(12,18,24,0))]"
              />
            </div>
            <div className="flex items-start justify-between gap-3 border-t border-border pt-3">
              <div>
                <p className="text-[13.5px] font-medium leading-tight tracking-[-0.008em]">
                  {look.name}
                </p>
                <p className="mt-1 text-[11.5px] leading-[1.45] text-foreground/55">
                  {lookPieces(look).map((piece) => (
                    <span key={piece.slug} className="block">
                      {piece.name}
                    </span>
                  ))}
                </p>
              </div>
              <span className="whitespace-nowrap text-[13.5px] font-medium tabular-nums">
                {formatPrice(look.price)}
              </span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
