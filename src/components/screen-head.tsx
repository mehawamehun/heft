import type { ReactNode } from "react";
import { ArrowRight } from "lucide-react";
import { Breadcrumbs, type Crumb } from "@/components/breadcrumbs";
import { Link } from "@/router";
import { cx } from "@/lib/cx";

export function ScreenHead({
  title,
  meta,
  crumb,
  action,
  size = "lg",
  hideTitle = false,
  className,
}: {
  title: string;
  meta?: ReactNode;
  crumb?: Crumb[];
  action?: ReactNode;
  size?: "lg" | "sm";
  hideTitle?: boolean;
  className?: string;
}) {
  return (
    <div className={cx("px-[var(--gutter)] pt-[104px]", className)}>
      {crumb && <Breadcrumbs items={crumb} />}
      <div className={cx("flex flex-wrap items-end justify-between gap-4", crumb ? "mt-1" : "mt-2")}>
        <div>
          <h1 className={hideTitle ? "sr-only" : size === "lg" ? "display" : "display-sm"}>
            {title}
          </h1>
          {meta && <div className="mt-2 text-[13.5px] text-foreground/55">{meta}</div>}
        </div>
        {action}
      </div>
    </div>
  );
}

export function QuietLink({
  to,
  children,
  className,
}: {
  to: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <Link
      to={to}
      className={cx(
        "inline-flex items-center gap-1.5 text-[13.5px] font-medium text-foreground/70 transition-colors hover:text-foreground",
        className,
      )}
    >
      {children}
      <ArrowRight className="size-[15px]" strokeWidth={1.7} />
    </Link>
  );
}
