import { Minus, Plus } from "lucide-react";

export function QuantityStepper({
  value,
  onChange,
  label,
}: {
  value: number;
  onChange: (next: number) => void;
  label: string;
}) {
  return (
    <div className="inline-flex items-center gap-1 rounded-full border border-border bg-white/80 px-1 py-1">
      <button
        type="button"
        aria-label={`Decrease quantity of ${label}`}
        onClick={() => onChange(value - 1)}
        className="grid size-7 place-items-center rounded-full text-foreground/60 transition-colors hover:bg-secondary hover:text-foreground"
      >
        <Minus className="size-3.5" strokeWidth={1.8} />
      </button>
      <span aria-live="polite" className="w-5 text-center text-[12.5px] tabular-nums">
        {value}
      </span>
      <button
        type="button"
        aria-label={`Increase quantity of ${label}`}
        onClick={() => onChange(value + 1)}
        className="grid size-7 place-items-center rounded-full text-foreground/60 transition-colors hover:bg-secondary hover:text-foreground"
      >
        <Plus className="size-3.5" strokeWidth={1.8} />
      </button>
    </div>
  );
}
