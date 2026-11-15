import { ArrowLeft } from "lucide-react";
import { articleCopy } from "@/data/site";
import { ScreenHead } from "@/components/screen-head";
import { Link } from "@/router";

export function InfoPage({ path }: { path: string }) {
  const copy = articleCopy[path] ?? {
    title: "Page not found",
    lines: ["This page is not part of the storefront preview.", "Return to the shop to keep browsing."],
  };

  return (
    <div className="pb-16">
      <ScreenHead
        title={copy.title}
        crumb={[{ label: "Home", href: "/" }, { label: copy.title }]}
      />
      <section className="px-[var(--gutter)] pt-6">
        <div className="surface max-w-[720px] rounded-[26px] p-[clamp(20px,2.6vw,32px)]">
          {copy.lines.map((line) => (
            <p key={line} className="mb-3 text-[14px] leading-[1.65] text-foreground/70 last:mb-0">
              {line}
            </p>
          ))}
          <Link
            to="/collections/shop"
            className="mt-5 inline-flex items-center gap-1.5 text-[13px] font-medium text-foreground/70 transition-colors hover:text-foreground"
          >
            <ArrowLeft className="size-3.5" strokeWidth={1.8} />
            Back to shop
          </Link>
        </div>
      </section>
    </div>
  );
}
