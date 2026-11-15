import { ArrowLeft, CreditCard, Lock } from "lucide-react";
import { formatPrice } from "@/data/catalog";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { ScreenHead } from "@/components/screen-head";
import { Link } from "@/router";
import { useCart } from "@/store/cart";
import { cx } from "@/lib/cx";

const states = ["Oregon", "California", "Washington", "New York", "Texas"];
const countries = ["United States", "Canada", "United Kingdom", "Japan"];

export function CheckoutPage() {
  const { lines, itemCount, subtotal, delivery, tax, total } = useCart();

  return (
    <div className="pb-10">
      <ScreenHead
        title="Checkout"
        size="sm"
        action={
          <Breadcrumbs
            items={[
              { label: "Bag", href: "/bag" },
              { label: "Information" },
              { label: "Payment" },
            ]}
            className="pb-1 text-[12px]"
          />
        }
      />

      <form
        className="px-[var(--gutter)] pt-6"
        onSubmit={(event) => event.preventDefault()}
        aria-label="Checkout"
      >
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(300px,380px)] lg:items-start lg:gap-10">
          <div className="surface rounded-[26px] p-[clamp(18px,2.4vw,30px)]">
            <fieldset>
              <legend className="text-[13.5px] font-medium">Contact</legend>
              <div className="mt-3 max-w-[440px]">
                <label htmlFor="email" className="field-label">
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  autoComplete="email"
                  defaultValue="a.okafor@fastmail.com"
                  className="field"
                />
              </div>
            </fieldset>

            <fieldset className="mt-7 border-t border-border pt-6">
              <legend className="text-[13.5px] font-medium">Delivery address</legend>
              <div className="mt-3 grid gap-3.5 sm:grid-cols-2">
                <div>
                  <label htmlFor="first-name" className="field-label">
                    First name
                  </label>
                  <input
                    id="first-name"
                    autoComplete="given-name"
                    defaultValue="Amara"
                    className="field"
                  />
                </div>
                <div>
                  <label htmlFor="last-name" className="field-label">
                    Last name
                  </label>
                  <input
                    id="last-name"
                    autoComplete="family-name"
                    defaultValue="Okafor"
                    className="field"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label htmlFor="address" className="field-label">
                    Address
                  </label>
                  <input
                    id="address"
                    autoComplete="street-address"
                    defaultValue="1417 SE Morrison Street"
                    className="field"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label htmlFor="apartment" className="field-label">
                    Apartment, suite (optional)
                  </label>
                  <input id="apartment" defaultValue="Apt 4B" className="field" />
                </div>
                <div>
                  <label htmlFor="city" className="field-label">
                    City
                  </label>
                  <input id="city" autoComplete="address-level2" defaultValue="Portland" className="field" />
                </div>
                <div>
                  <label htmlFor="state" className="field-label">
                    State
                  </label>
                  <select id="state" defaultValue="Oregon" className="field">
                    {states.map((state) => (
                      <option key={state}>{state}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label htmlFor="zip" className="field-label">
                    ZIP code
                  </label>
                  <input id="zip" autoComplete="postal-code" defaultValue="97214" className="field" />
                </div>
                <div>
                  <label htmlFor="country" className="field-label">
                    Country
                  </label>
                  <select id="country" defaultValue="United States" className="field">
                    {countries.map((country) => (
                      <option key={country}>{country}</option>
                    ))}
                  </select>
                </div>
              </div>
            </fieldset>

            <fieldset className="mt-7 border-t border-border pt-6">
              <legend className="text-[13.5px] font-medium">Delivery method</legend>
              <div className="mt-3">
                {[
                  { id: "standard", label: "Standard", note: "3–5 business days", price: "Free" },
                  { id: "express", label: "Express", note: "1–2 business days", price: "$12.00" },
                ].map((option, index) => (
                  <label
                    key={option.id}
                    className="flex cursor-pointer items-center gap-3 border-t border-border py-3.5 first:border-t-0"
                  >
                    <input
                      type="radio"
                      name="delivery"
                      value={option.id}
                      defaultChecked={index === 0}
                      className="peer sr-only"
                    />
                    <span
                      aria-hidden
                      className="grid size-4 shrink-0 place-items-center rounded-full border border-border bg-white peer-checked:border-[5px] peer-checked:border-foreground"
                    />
                    <span className="flex-1">
                      <span className="block text-[13px] font-medium">{option.label}</span>
                      <span className="mt-0.5 block text-[11.5px] text-foreground/55">
                        {option.note}
                      </span>
                    </span>
                    <span className="text-[12.5px] tabular-nums">{option.price}</span>
                  </label>
                ))}
              </div>
            </fieldset>

            <fieldset className="mt-7 border-t border-border pt-6">
              <legend className="flex w-full items-center justify-between text-[13.5px] font-medium">
                Payment
                <span className="inline-flex items-center gap-1 text-[11px] font-normal text-foreground/50">
                  <Lock className="size-3" strokeWidth={1.8} />
                  Encrypted connection
                </span>
              </legend>
              <div className="mt-3 grid gap-3.5 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <label htmlFor="card" className="field-label">
                    Card number
                  </label>
                  <div className="relative">
                    <input
                      id="card"
                      inputMode="numeric"
                      autoComplete="cc-number"
                      placeholder="1234 1234 1234 1234"
                      className="field pr-11"
                    />
                    <CreditCard
                      aria-hidden
                      className="pointer-events-none absolute right-3.5 top-1/2 size-4 -translate-y-1/2 text-foreground/35"
                      strokeWidth={1.7}
                    />
                  </div>
                </div>
                <div>
                  <label htmlFor="expiry" className="field-label">
                    Expiry
                  </label>
                  <input
                    id="expiry"
                    autoComplete="cc-exp"
                    placeholder="MM / YY"
                    className="field"
                  />
                </div>
                <div>
                  <label htmlFor="cvc" className="field-label">
                    CVC
                  </label>
                  <input id="cvc" autoComplete="cc-csc" placeholder="123" className="field" />
                </div>
                <div className="sm:col-span-2">
                  <label htmlFor="card-name" className="field-label">
                    Name on card
                  </label>
                  <input id="card-name" autoComplete="cc-name" defaultValue="Amara Okafor" className="field" />
                </div>
              </div>
              <p className="mt-2.5 text-[11.5px] text-foreground/45">
                Billing address is the delivery address.
              </p>
            </fieldset>
          </div>

          <aside className="surface h-fit rounded-[26px] p-[clamp(18px,2vw,24px)]">
            <div className="flex items-baseline justify-between">
              <h2 className="text-[13.5px] font-medium">Order summary</h2>
              <span className="text-[11.5px] text-foreground/45">
                {itemCount} {itemCount === 1 ? "item" : "items"}
              </span>
            </div>

            <ul className="mt-4">
              {lines.map((line) => (
                <li key={line.key} className="flex items-center gap-3 border-t border-border py-3 first:border-t-0 first:pt-0">
                  <span className="grid size-12 shrink-0 place-items-center rounded-xl bg-white/70">
                    <img src={line.image} alt="" className="h-10 w-auto object-contain" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-[12.5px] font-medium">{line.name}</span>
                    <span className="mt-0.5 block text-[11px] text-foreground/55">
                      {line.colour}, {line.size}
                    </span>
                  </span>
                  <span className="text-[12.5px] tabular-nums">
                    {formatPrice(line.price * line.qty)}
                  </span>
                </li>
              ))}
            </ul>

            <dl className="mt-2 space-y-2 border-t border-border pt-3 text-[12.5px]">
              <div className="flex justify-between">
                <dt className="text-foreground/60">Subtotal</dt>
                <dd className="tabular-nums">${subtotal.toFixed(2)}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-foreground/60">Delivery</dt>
                <dd className="tabular-nums">{delivery === 0 ? "Free" : `$${delivery.toFixed(2)}`}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-foreground/60">Estimated tax</dt>
                <dd className="tabular-nums">${tax.toFixed(2)}</dd>
              </div>
            </dl>

            <div className="mt-3 flex items-baseline justify-between border-t border-border pt-3 text-[14px] font-medium">
              <span>Total</span>
              <span className="tabular-nums">${total.toFixed(2)}</span>
            </div>

            <button type="submit" className="pill pill--primary mt-3.5 h-11 w-full">
              Pay ${total.toFixed(2)}
            </button>
            <Link
              to="/bag"
              className={cx(
                "mt-2.5 flex items-center justify-center gap-1.5 text-[12.5px] text-foreground/60 transition-colors hover:text-foreground",
              )}
            >
              <ArrowLeft className="size-3.5" strokeWidth={1.8} />
              Return to bag
            </Link>
            <p className="mt-3 flex justify-center gap-3 text-[11px] text-foreground/35">
              <span>USD $</span>
              <span>United States</span>
            </p>
          </aside>
        </div>
      </form>
    </div>
  );
}
