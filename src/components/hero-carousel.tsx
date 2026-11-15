import { useEffect, useRef, useState, type CSSProperties, type PointerEvent } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { formatPrice, looks } from "@/data/catalog";
import { Link } from "@/router";

const N = looks.length;

type VisibleCount = 1 | 3 | 5;

function readVisibleCount(): VisibleCount {
  if (typeof window === "undefined") return 5;
  if (window.matchMedia("(max-width: 640px)").matches) return 1;
  if (window.matchMedia("(max-width: 1100px)").matches) return 3;
  return 5;
}

function useVisibleCount() {
  const [visible, setVisible] = useState<VisibleCount>(readVisibleCount);

  useEffect(() => {
    const update = () => setVisible(readVisibleCount());
    const mqs = ["(max-width: 640px)", "(max-width: 1100px)"].map((q) =>
      window.matchMedia(q),
    );
    mqs.forEach((mq) => mq.addEventListener("change", update));
    window.addEventListener("resize", update);
    return () => {
      mqs.forEach((mq) => mq.removeEventListener("change", update));
      window.removeEventListener("resize", update);
    };
  }, []);

  return visible;
}

/**
 * Shortest signed circular offset of look `li` from the active look.
 * Lives in [-N/2, N/2) so an off-stage look is always parked on the side it
 * will re-enter from — the buffer slots a cloned-track carousel would need,
 * realised without any duplicate DOM. The loop can turn forever with no reset.
 */
function circularOffset(li: number, active: number) {
  let d = (((li - active) % N) + N) % N;
  if (d > N / 2) d -= N;
  return d;
}

/** Pick the shortest circular path so clicking any dot feels instant. */
function shortestDelta(fromLogical: number, toLogical: number) {
  let delta = toLogical - fromLogical;
  if (delta > N / 2) delta -= N;
  if (delta < -N / 2) delta += N;
  return delta;
}

function charHeight(absOffset: number, isCenter: boolean) {
  if (isCenter) return "80%";
  if (absOffset === 1) return "65%";
  return "57%";
}

export function HeroCarousel() {
  const visible = useVisibleCount();
  const half = Math.floor(visible / 2);

  // Unbounded cursor — never reset, never wrapped. Each slide resolves its
  // own circular offset from it, so state changes only ever happen at the
  // START of a move. Nothing re-renders after the animation ends.
  const [active, setActive] = useState(0);
  const logical = ((active % N) + N) % N;

  // Exact slot width in px, measured from the real stage. Transforms are
  // written directly as inline px values — never through a custom property —
  // so the horizontal glide fires as a plain CSS transition in every browser.
  const stageRef = useRef<HTMLDivElement>(null);
  const [gap, setGap] = useState(() =>
    typeof window === "undefined" ? 288 : window.innerWidth / visible,
  );

  useEffect(() => {
    const el = stageRef.current;
    if (!el) return;
    const measure = () => {
      const w = el.clientWidth;
      if (w > 0) setGap(w / visible);
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, [visible]);

  const pointerRef = useRef<{ id: number; x: number } | null>(null);
  const swipedRef = useRef(false);

  // No animation lock: CSS transitions retarget mid-flight smoothly, so
  // rapid clicks/swipes keep gliding in the requested direction.
  const go = (delta: number) => {
    if (delta === 0) return;
    setActive((current) => current + delta);
  };

  const onPointerDown = (event: PointerEvent<HTMLDivElement>) => {
    if (event.pointerType === "mouse" && event.button !== 0) return;
    pointerRef.current = { id: event.pointerId, x: event.clientX };
    // A fresh press is never a swipe — only a real drag can set the flag.
    swipedRef.current = false;
  };

  const onPointerUp = (event: PointerEvent<HTMLDivElement>) => {
    const start = pointerRef.current;
    pointerRef.current = null;
    if (!start || start.id !== event.pointerId) return;
    const dx = event.clientX - start.x;
    if (Math.abs(dx) < 40) return;
    swipedRef.current = true;
    go(dx < 0 ? 1 : -1);
  };

  return (
    <section
      aria-label="Fall Winter 26 looks"
      className="relative flex flex-col overflow-hidden pt-[92px] hero-section max-md:pb-4"
    >
      <div className="relative flex min-h-0 flex-1 items-end hero-stage">
        {/* ── Prev arrow ── */}
        <button
          type="button"
          aria-label="Previous look"
          onClick={() => go(-1)}
          className="hero-arrow hero-arrow--left"
        >
          <ArrowLeft className="size-[19px] max-sm:size-[15px]" strokeWidth={1.7} />
        </button>

        {/* ── Stage ── */}
        <div
          ref={stageRef}
          role="group"
          aria-label="Look carousel"
          aria-roledescription="carousel"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === "ArrowLeft") { e.preventDefault(); go(-1); }
            if (e.key === "ArrowRight") { e.preventDefault(); go(1); }
          }}
          onPointerDown={onPointerDown}
          onPointerUp={onPointerUp}
          onPointerCancel={() => { pointerRef.current = null; }}
          className="relative h-full w-full overflow-hidden"
          style={{ "--vis": visible } as CSSProperties}
        >
          {looks.map((look, li) => {
            const d = circularOffset(li, logical);
            const abs = Math.abs(d);
            const isCenter = d === 0;
            const isVisible = abs <= half;

            // One px-exact transform carries BOTH the centreing offset and
            // the slot position, so every character travels the track in the
            // interaction direction and lands precisely on its slot.
            const tx = -gap / 2 + d * gap;

            return (
              <Link
                key={look.slug}
                to={`/looks/${look.slug}`}
                data-look={look.slug}
                aria-hidden={!isVisible ? true : undefined}
                tabIndex={!isVisible ? -1 : undefined}
                className="hero-slide"
                data-center={isCenter ? "true" : undefined}
                onClick={(e) => {
                  if (swipedRef.current) {
                    e.preventDefault();
                    swipedRef.current = false;
                    return;
                  }
                  // Clicking any non-centre character slides it to the centre.
                  if (!isCenter) {
                    e.preventDefault();
                    go(d);
                  }
                }}
                style={
                  {
                    width: gap,
                    transform: `translateX(${tx.toFixed(2)}px)`,
                    "--char-h": charHeight(abs, isCenter),
                    "--opacity": isVisible
                      ? isCenter ? 1 : Math.max(0.65, 1 - 0.14 * abs)
                      : 0,
                    zIndex: isCenter ? 30 : abs === 1 ? 20 : 10,
                  } as CSSProperties
                }
              >
                {/* Character image fills most of the slide height */}
                <span className="hero-figure">
                  <span aria-hidden className="hero-cast" />
                  <img
                    src={look.image}
                    alt={look.alt}
                    /* All 8 characters are eager: a parked slide re-entering
                       the window must never pop its image in mid-glide. */
                    loading="eager"
                    decoding="async"
                    draggable={false}
                    className="hero-character-img"
                  />
                </span>

                {/* Label sits BELOW the shoes, outside / after the figure */}
                {isVisible && (
                  <span className="hero-label">
                    <span className="hero-label-name">{look.name}</span>
                    <span className="hero-label-price">{formatPrice(look.price)}</span>
                  </span>
                )}
              </Link>
            );
          })}
        </div>

        {/* ── Next arrow ── */}
        <button
          type="button"
          aria-label="Next look"
          onClick={() => go(1)}
          className="hero-arrow hero-arrow--right"
        >
          <ArrowRight className="size-[19px] max-sm:size-[15px]" strokeWidth={1.7} />
        </button>
      </div>

      {/* ── Dot indicators ── */}
      <div className="flex justify-center gap-[6px] mt-3 mb-1" role="tablist" aria-label="Looks">
        {looks.map((look, idx) => (
          <button
            key={look.slug}
            type="button"
            role="tab"
            aria-label={`Go to ${look.name}`}
            aria-selected={idx === logical}
            onClick={() => go(shortestDelta(logical, idx))}
            className={`hero-dot${idx === logical ? " hero-dot--active" : ""}`}
          />
        ))}
      </div>

      {/* ── Collection bar ── */}
      <div className="glass mx-[var(--gutter)] mt-2 flex h-[74px] items-center justify-between gap-4 rounded-[20px] pl-[22px] pr-3 max-md:h-auto max-md:flex-col max-md:items-stretch max-md:gap-2.5 max-md:px-4 max-md:py-3.5">
        <div className="flex min-w-0 items-baseline gap-4">
          <span className="whitespace-nowrap text-[15px] font-bold tracking-[-0.01em]">Fall / Winter 26</span>
          <span className="whitespace-nowrap text-[13px] font-normal tabular-nums tracking-[0.01em] text-foreground/55">
            {looks.length} looks
          </span>
        </div>
        <div className="flex items-center gap-2 max-md:w-full">
          <Link to="/lookbook" className="pill pill--glass max-md:flex-1">
            View lookbook
            <ArrowRight className="size-4" strokeWidth={1.7} />
          </Link>
          <Link to="/collections/shop" className="pill pill--primary max-md:flex-1">
            Shop the collection
            <ArrowRight className="size-4" strokeWidth={1.7} />
          </Link>
        </div>
      </div>
    </section>
  );
}
