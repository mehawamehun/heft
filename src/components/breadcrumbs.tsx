import { Link } from "@/router";
import { cx } from "@/lib/cx";

export type Crumb = {
  label: string;
  href?: string;
};

export function Breadcrumbs({ items, className }: { items: Crumb[]; className?: string }) {
  return (
    <nav aria-label="Breadcrumb" className={cx("flex flex-wrap items-center gap-2 text-[12px]", className)}>
      {items.map((item, index) => (
        <span key={`${item.label}-${index}`} className="flex items-center gap-2">
          {index > 0 && (
            <span aria-hidden className="text-foreground/25">
              /
            </span>
          )}
          {item.href ? (
            <Link to={item.href} className="text-foreground/45 transition-colors hover:text-foreground">
              {item.label}
            </Link>
          ) : (
            <span className="text-foreground/70" aria-current="page">
              {item.label}
            </span>
          )}
        </span>
      ))}
    </nav>
  );
}
