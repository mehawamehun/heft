import { footerColumns } from "@/data/site";
import { Link } from "@/router";

export function SiteFooter() {
  return (
    <footer className="mt-8 border-t border-border pt-8 sm:pt-10">
      <div className="mx-auto grid max-w-[1600px] gap-8 px-[var(--gutter)] pb-9 md:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)] md:gap-16">
        <div>
          <Link to="/" className="wordmark text-[17px]">
            HEFT
            <sup>®</sup>
          </Link>
          <p className="mt-2 text-[13px] text-foreground/55">Heavyweight outerwear</p>
          <form className="mt-5 max-w-[320px]" onSubmit={(event) => event.preventDefault()}>
            <label className="mb-2 block text-[12.5px] text-foreground/55" htmlFor="footer-email">
              Email
            </label>
            <div className="glass flex items-center gap-2 rounded-full p-1 pl-4">
              <input
                id="footer-email"
                type="email"
                autoComplete="email"
                placeholder="you@domain.com"
                className="h-9 min-w-0 flex-1 border-0 bg-transparent text-[13.5px] outline-none placeholder:text-foreground/35"
              />
              <button
                type="submit"
                className="pill pill--primary h-[38px] px-[18px] text-[13.5px]"
              >
                Subscribe
              </button>
            </div>
          </form>
        </div>

        <nav aria-label="Footer" className="grid grid-cols-2 gap-[18px] sm:grid-cols-3 sm:gap-[22px]">
          {footerColumns.map((column) => (
            <div key={column.title}>
              <h3 className="mb-2.5 text-[12.5px] font-semibold">{column.title}</h3>
              {column.links.map((link) => (
                <Link
                  key={link.label}
                  to={link.href}
                  className="block py-1 text-[13px] text-foreground/55 transition-colors hover:text-foreground"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          ))}
        </nav>
      </div>

      <div className="mx-auto flex max-w-[1600px] flex-col gap-2 border-t border-border px-[var(--gutter)] py-4 text-[12px] text-foreground/40 sm:flex-row sm:items-center sm:justify-between">
        <span>© 2026 HEFT®</span>
        <div className="flex gap-[18px]">
          <Link to="/privacy" className="transition-colors hover:text-foreground">
            Privacy
          </Link>
          <Link to="/terms" className="transition-colors hover:text-foreground">
            Terms
          </Link>
        </div>
        <div className="flex gap-3.5">
          <span>USD $</span>
          <span>United States</span>
        </div>
      </div>
    </footer>
  );
}
