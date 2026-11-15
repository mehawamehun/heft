import { useEffect, useRef, useState, type CSSProperties, type PointerEvent } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { formatPrice, looks } from "@/data/catalog";
import { Link } from "@/router";

const SLIDE_MS = 1000;
const COPIES = 3;
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

function wrapToMiddle(index: number) {
  let next = index;
  while (next < N) next += N;
  while (next >= N * 2) next -= N;
  return next;
}

function shortestDelta(fromLogical: number, toLogical: number) {
  let delta = toLogical - fromLogical;
  if (delta > N / 2) delta -= N;
  if (delta < -N / 2) delta += N;
  return delta;
}

function charHeight(absOffset: number, isCenter: boolean) {
  if (isCenter) return "78%";
  if (absOffset === 1) return "64%";
  return "58%";
}

export function HeroCarousel() {
  const visible = useVisibleCount();
  const half = Math.floor(visible / 2);

  // Cursor is an index into the triplicated slide list. Middle copy starts at N.
  const [cursor, setCursor] = useState(N);
  const [animating, setAnimating] = useState(false);
  const [instant, setInstant] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const jumpRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pointerRef = useRef<{ id: number; x: number } | null>(null);
  const swipedRef = useRef(false);

  const logical = ((cursor % N) + N) % N;

  const go = (delta: number) => {
    if (animating || delta === 0) return;
    setAnimating(true);
    setCursor((c) => c + delta);
    if (timerRef.current) clearTimeout(timerRef.current);
    if (jumpRef.current) clearTimeout(jumpRef.current);
    timerRef.current = setTimeout(() => {
      setInstant(true);
      setCursor((c) => wrapToMiddle(c));
      jumpRef.current = setTimeout(() => {
        setInstant(false);
        setAnimating(false);
      }, 24);
    }, SLIDE_MS);
  };

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      if (jumpRef.current) clearTimeout(jumpRef.current);
    };
  }, []);

  const windowStart = cursor - half;
  const slides = Array.from({ length: COPIES * N }, (_, index) => ({
    index,
    look: looks[index % N],
  }));

  const onPointerDown = (event: PointerEvent<HTMLDivElement>) => {
    if (event.pointerType === "mouse" && event.button !== 0) return;
    pointerRef.current = { id: event.pointerId, x: event.clientX };
  };

  const onPointerUp = (event: PointerEvent<HTMLDivElement>) => {
    const start = pointerRef.current;
    pointerRef.current = null;
    if (!start || start.id !== event.pointerId) return;
    const dx = event.clientX - start.x;
    if (Math.abs(dx) < 56) return;
    swipedRef.current = true;
    go(dx < 0 ? 1 : -1);
  };

  return (
    <section
      aria-label="Fall Winter 26 looks"
      className="relative flex flex-col overflow-hidden pt-[92px] hero-section max-md:pb-4"
    >
      <div className="relative flex min-h-0 flex-1 items-end hero-stage">
        <button
          type="button"
          aria-label="Previous look"
          onClick={() => go(-1)}
          className="glass absolute left-[clamp(4px,1vw,14px)] top-1/2 z-20 -translate-y-1/2 grid size-[52px] place-items-center rounded-full bg-white/88 text-foreground transition-all hover:bg-white max-sm:size-[44px]"
        >
          <ArrowLeft className="size-[19px] max-sm:size-[15px]" strokeWidth={1.7} />
        </button>

        <div
          role="group"
          aria-label="Look carousel"
          aria-roledescription="carousel"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === "ArrowLeft") {
              e.preventDefault();
              go(-1);
            }
            if (e.key === "ArrowRight") {
              e.preventDefault();
              go(1);
            }
          }}
          onPointerDown={onPointerDown}
          onPointerUp={onPointerUp}
          onPointerCancel={() => {
            pointerRef.current = null;
          }}
          className="relative h-full w-full overflow-hidden"
          style={{ "--half": half, "--vis": visible } as CSSProperties}
        >
          <div
            className={`hero-track${instant ? " hero-track--instant" : ""}`}
            style={{ "--i": windowStart } as CSSProperties}
          >
            {slides.map(({ look, index }) => {
              const offset = index - cursor;
              const abs = Math.abs(offset);
              const isCenter = offset === 0;
              const isVisible = abs <= half;

              return (
                <Link
                  key={`${index}-${look.slug}`}
                  to={`/looks/${look.slug}`}
                  aria-hidden={!isVisible ? true : undefined}
                  tabIndex={!isVisible ? -1 : undefined}
                  className="hero-slide"
                  data-offset={offset}
                  data-center={isCenter ? "true" : undefined}
                  onClick={(e) => {
                    if (swipedRef.current) {
                      e.preventDefault();
                      swipedRef.current = false;
                      return;
                    }
                    if (!isCenter) {
                      e.preventDefault();
                      go(offset);
                    }
                  }}
                  style={
                    {
                      "--offset": offset,
                      "--char-h": charHeight(abs, isCenter),
                      "--opacity": isVisible
                        ? isCenter
                          ? 1
                          : Math.max(0.7, 1 - 0.12 * abs)
                        : 0,
                    } as CSSProperties
                  }
                >
                  <span className="hero-figure">
                    <span aria-hidden className="hero-cast" />
                    <img
                      src={look.image}
                      alt={look.alt}
                      loading={abs <= 2 ? "eager" : "lazy"}
                      decoding="async"
                      draggable={false}
                      className="hero-character-img"
                    />
                  </span>
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
        </div>

        <button
          type="button"
          aria-label="Next look"
          onClick={() => go(1)}
          className="glass absolute right-[clamp(4px,1vw,14px)] top-1/2 z-20 -translate-y-1/2 grid size-[52px] place-items-center rounded-full bg-white/88 text-foreground transition-all hover:bg-white max-sm:size-[44px]"
        >
          <ArrowRight className="size-[19px] max-sm:size-[15px]" strokeWidth={1.7} />
        </button>
      </div>

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

      <div className="glass mx-[var(--gutter)] mt-2 flex h-[74px] items-center justify-between gap-4 rounded-[20px] pl-[22px] pr-3 max-md:h-auto max-md:flex-col max-md:items-stretch max-md:gap-2.5 max-md:px-4 max-md:py-3.5">
        <div className="flex min-w-0 items-baseline gap-4">
          <span className="whitespace-nowrap text-[15px] font-medium">Fall / Winter 26</span>
          <span className="whitespace-nowrap text-[13.5px] tabular-nums text-foreground/60">
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
