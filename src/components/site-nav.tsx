import { useEffect, useState } from "react";
import { Menu, Search, ShoppingBag, User, X } from "lucide-react";
import { Link, useRouter } from "@/router";
import { navLinks } from "@/data/site";
import { useCart } from "@/store/cart";
import { cx } from "@/lib/cx";

export function SiteNav() {
  const { pathname } = useRouter();
  const { itemCount } = useCart();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const isActive = (href: string) => {
    if (href === "/collections") return pathname === "/collections";
    if (href === "/collections/shop") {
      return pathname.startsWith("/collections") || pathname.startsWith("/products");
    }
    if (href === "/lookbook") {
      return pathname === "/lookbook" || pathname.startsWith("/looks");
    }
    return pathname === href || pathname.startsWith(`${href}/`);
  };

  return (
    <header className="fixed inset-x-[var(--gutter)] top-4 z-80">
      <div className="glass grid h-[58px] grid-cols-[1fr_auto] items-center rounded-[20px] pl-4 pr-2.5 md:h-[62px] md:grid-cols-[1fr_auto_1fr] md:pl-[22px]">
        <Link to="/" className="wordmark" aria-label="HEFT home">
          HEFT
          <sup>®</sup>
        </Link>

        <nav aria-label="Primary" className="hidden items-center gap-[30px] md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.label}
              to={link.href}
              aria-current={isActive(link.href) ? "page" : undefined}
              className={cx(
                "border-b border-transparent py-1.5 text-[14px] font-medium tracking-[-0.012em] text-foreground/70 transition-colors hover:border-border hover:text-foreground",
                isActive(link.href) && "text-foreground",
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center justify-end gap-0.5">
          <button
            type="button"
            aria-label={open ? "Close menu" : "Menu"}
            aria-expanded={open}
            onClick={() => setOpen((value) => !value)}
            className="grid size-10 place-items-center rounded-full text-foreground transition-colors hover:bg-foreground/5 md:hidden"
          >
            {open ? (
              <X className="size-[18px]" strokeWidth={1.7} />
            ) : (
              <Menu className="size-[18px]" strokeWidth={1.7} />
            )}
          </button>
          <Link
            to="/search"
            aria-label="Search"
            className="grid size-10 place-items-center rounded-full text-foreground transition-colors hover:bg-foreground/5"
          >
            <Search className="size-[18px]" strokeWidth={1.7} />
          </Link>
          <Link
            to="/account"
            aria-label="Account"
            aria-current={isActive("/account") ? "page" : undefined}
            className="grid size-10 place-items-center rounded-full text-foreground transition-colors hover:bg-foreground/5"
          >
            <User className="size-[18px]" strokeWidth={1.7} />
          </Link>
          <Link
            to="/bag"
            aria-label={`Bag, ${itemCount} ${itemCount === 1 ? "item" : "items"}`}
            className="relative grid size-10 place-items-center rounded-full text-foreground transition-colors hover:bg-foreground/5"
          >
            <ShoppingBag className="size-[18px]" strokeWidth={1.7} />
            {itemCount > 0 && (
              <span className="absolute right-[3px] top-1 grid h-4 min-w-4 place-items-center rounded-full bg-foreground px-1 text-[9.5px] font-medium leading-4 text-primary-foreground ring-2 ring-white/90">
                {itemCount}
              </span>
            )}
          </Link>
        </div>
      </div>

      {open && (
        <nav
          aria-label="Primary mobile"
          className="glass mt-2 rounded-[20px] p-3 md:hidden"
        >
          {navLinks.map((link) => (
            <Link
              key={link.label}
              to={link.href}
              className="block rounded-xl px-3 py-2.5 text-[14px] text-foreground/75"
            >
              {link.label}
            </Link>
          ))}
          <Link to="/bag" className="block rounded-xl px-3 py-2.5 text-[14px] text-foreground/75">
            Bag ({itemCount})
          </Link>
        </nav>
      )}
    </header>
  );
}
