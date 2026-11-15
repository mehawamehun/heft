import { useEffect, useMemo, useRef, useState, type CSSProperties, type PointerEvent } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { formatPrice, looks } from "@/data/catalog";
import { Link } from "@/router";
import { cx } from "@/lib/cx";

const N = looks.length;

/** Release threshold (px): past this the drag snaps to the next/prev slot. */
const DRAG_THRESHOLD = 40;
/** Drags longer than this suppress the link click, so a swipe never opens a look. */
const DRAG_JITTER = 12;
/** Drags under this never engage the carousel at all (a tap stays a tap). */
const DRAG_ENGAGE = 6;

/** peek = phones (<768px): big centre + two peeks. mid = 768–1100. full = desktop. */
type Mode = "peek" | "mid" | "full";

function readMode(): Mode {
  if (typeof window === "undefined") return "full";
  if (window.matchMedia("(max-width: 767.98px)").matches) return "peek";
  if (window.matchMedia("(max-width: 1100px)").matches) return "mid";
  return "full";
}

function useMode() {
  const [mode, setMode] = useState<Mode>(readMode);
  useEffect(() => {
    const update = () => setMode(readMode());
    const queries = ["(max-width: 767.98px)", "(max-width: 1100px)"].map((q) =>
      window.matchMedia(q),
    );
    queries.forEach((mq) => mq.addEventListener("change", update));
    window.addEventListener("resize", update);
    return () => {
      queries.forEach((mq) => mq.removeEventListener("change", update));
      window.removeEventListener("resize", update);
    };
  }, []);
  return mode;
}

/**
 * Shortest signed circular offset of look `li` from the active look.
 * Lives in [-N/2, N/2) so an off-stage look is always parked on the side it
 * will re-enter from — the buffered slots a cloned-track carousel needs,
 * realised without duplicate DOM. The loop turns forever with no reset.
 */
function circularOffset(li: number, active: number) {
  let d = (((li - active) % N) + N) % N;
  if (d > N / 2) d -= N;
  return d;
}

/** Shortest circular path for dot clicks. */
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

type Geometry = { centerW: number; sideW: number; step: number; park: number };

export function HeroCarousel() {
  const mode = useMode();
  const half = mode === "full" ? 2 : 1;

  // Unbounded cursor — never reset, never wrapped. Nothing re-renders after
  // an animation ends, so there is no end-of-slide snap, ever.
  const [active, setActive] = useState(0);
  const logical = ((active % N) + N) % N;

  // Measured stage width → exact px slot geometry (never % / var indirect).
  const stageRef = useRef<HTMLDivElement>(null);
  const [stageW, setStageW] = useState(() =>
    typeof window === "undefined" ? 1200 : Math.round(window.innerWidth * 0.92),
  );

  useEffect(() => {
    const el = stageRef.current;
    if (!el) return;
    const measure = () => {
      const w = el.clientWidth;
      if (w > 0) setStageW(w);
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  /**
   * Slot geometry.
   *  - phones: centre slot 68% of the stage, side slots 24%, small gap —
   *    the side characters peek in from the screen edges.
   *  - 768–1100px: 3 uniform slots. Desktop: 5 uniform slots, zero overlap.
   */
  const geo = useMemo<Geometry>(() => {
    if (mode === "peek") {
      const centerW = stageW * 0.68;
      const sideW = stageW * 0.24;
      const gap = stageW * 0.02;
      return { centerW, sideW, step: centerW / 2 + sideW / 2 + gap, park: sideW + gap };
    }
    const slotW = stageW / (mode === "mid" ? 3.25 : 5.1);
    return { centerW: slotW, sideW: slotW, step: slotW, park: slotW };
  }, [mode, stageW]);

  /** Centre-line x of a slot, relative to the stage centre. */
  const slotCenter = (d: number) => {
    const abs = Math.abs(d);
    if (abs <= half) return Math.sign(d) * geo.step * abs;
    // Buffered slots park further out on their re-entry side.
    return Math.sign(d) * (geo.step * half + geo.park * (abs - half));
  };
  const slotWidth = (d: number) => (d === 0 ? geo.centerW : geo.sideW);
  const translateFor = (d: number) => -slotWidth(d) / 2 + slotCenter(d);

  // ── Drag-to-slide (pointer events cover touch, mouse and pen) ──
  const [dragPx, setDragPx] = useState(0);
  const [dragging, setDragging] = useState(false);
  const dragRef = useRef<{ id: number; x: number } | null>(null);
  const swipedRef = useRef(false);

  const go = (delta: number) => {
    if (delta === 0) return;
    setActive((current) => current + delta);
  };

  const onPointerDown = (event: PointerEvent<HTMLDivElement>) => {
    if (event.pointerType === "mouse" && event.button !== 0) return;
    dragRef.current = { id: event.pointerId, x: event.clientX };
    swipedRef.current = false;
    // NOTE: no setPointerCapture here — capturing on press would retarget the
    // browser's `click` to the stage and break character taps. We capture
    // only once a real drag engages, in onPointerMove.
  };

  const onPointerMove = (event: PointerEvent<HTMLDivElement>) => {
    const start = dragRef.current;
    if (!start || start.id !== event.pointerId) return;
    const dx = event.clientX - start.x;
    if (Math.abs(dx) > DRAG_JITTER) swipedRef.current = true;
    if (Math.abs(dx) > DRAG_ENGAGE) {
      // Real-time follow: the whole row tracks the pointer 1:1.
      if (!dragging) {
        setDragging(true);
        try {
          stageRef.current?.setPointerCapture(event.pointerId);
        } catch {
          /* capture is best-effort */
        }
      }
      setDragPx(dx);
      event.preventDefault();
    }
  };

  const finishDrag = (event: PointerEvent<HTMLDivElement>, commit: boolean) => {
    const start = dragRef.current;
    dragRef.current = null;
    try {
      stageRef.current?.releasePointerCapture(event.pointerId);
    } catch {
      /* already released */
    }
    if (!start || start.id !== event.pointerId) return;
    const dx = event.clientX - start.x;
    setDragging(false);
    if (!commit || Math.abs(dx) < DRAG_THRESHOLD) {
      // Below threshold: spring back to the current active character.
      setDragPx(0);
      return;
    }
    const steps = Math.min(2, Math.max(1, Math.round(Math.abs(dx) / geo.step)));
    setDragPx(0);
    go(dx < 0 ? steps : -steps);
  };

  const onPointerUp = (event: PointerEvent<HTMLDivElement>) => finishDrag(event, true);
  const onPointerCancel = (event: PointerEvent<HTMLDivElement>) => finishDrag(event, false);

  return (
    <section
      aria-label="Fall Winter 26 looks"
      className="relative flex flex-col overflow-hidden pt-[92px] max-md:pt-[84px] hero-section max-md:pb-4"
    >
      <div className="relative flex items-end hero-stage">
        {/* ── Prev arrow ── */}
        <button
          type="button"
          aria-label="Previous look"
          onClick={() => go(-1)}
          className="hero-arrow hero-arrow--left"
        >
          <ArrowLeft className="size-[19px] max-sm:size-[15px]" strokeWidth={1.7} />
        </button>

        {/* ── Stage: explicit height from CSS, never collapses ── */}
        <div
          ref={stageRef}
          data-testid="hero-stage"
          role="group"
          aria-label="Look carousel"
          aria-roledescription="carousel"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === "ArrowLeft") { e.preventDefault(); go(-1); }
            if (e.key === "ArrowRight") { e.preventDefault(); go(1); }
          }}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerCancel={onPointerCancel}
          onDragStart={(e) => e.preventDefault()}
          className={cx(
            "relative h-full w-full overflow-hidden touch-pan-y select-none cursor-grab active:cursor-grabbing",
            dragging && "hero-stage--dragging",
          )}
        >
          {looks.map((look, li) => {
            const d = circularOffset(li, logical);
            const abs = Math.abs(d);
            const isCenter = d === 0;
            const isVisible = abs <= half;

            const opacity = !isVisible
              ? 0
              : isCenter
                ? 1
                : mode === "peek"
                  ? 0.75 // phone peeks
                  : Math.max(0.65, 1 - 0.14 * abs);
            const scale = isCenter ? 1.12 : mode === "peek" ? 0.82 : 0.92;

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
                    width: slotWidth(d),
                    transform: `translateX(${(translateFor(d) + (dragging ? dragPx : 0)).toFixed(2)}px)`,
                    "--char-h": charHeight(abs, isCenter),
                    "--char-scale": scale,
                    "--opacity": opacity,
                    zIndex: isCenter ? 30 : abs === 1 ? 20 : 10,
                  } as CSSProperties
                }
              >
                <span className="hero-figure">
                  <span aria-hidden className="hero-cast" />
                  {/* All characters eager: a re-entering slide must never pop
                     its image in mid-glide. */}
                  <img
                    src={look.image}
                    alt={look.alt}
                    loading="eager"
                    decoding="async"
                    draggable={false}
                    className="hero-character-img"
                  />
                </span>

                {/* Name + price sit BELOW the shoes, never on the figure */}
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
      <div className="flex justify-center gap-[6px] mt-2.5 mb-0.5" role="tablist" aria-label="Looks">
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
      <div className="glass mx-[var(--gutter)] mt-2 flex h-[64px] items-center justify-between gap-4 rounded-[18px] pl-[18px] pr-2.5 max-md:h-auto max-md:flex-col max-md:items-stretch max-md:gap-2 max-md:px-4 max-md:py-3">
        <div className="flex min-w-0 items-baseline gap-3.5">
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
