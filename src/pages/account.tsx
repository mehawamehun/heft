import { useState } from "react";
import { ChevronDown, ChevronUp, Package } from "lucide-react";
import { account, formatPrice, getProduct, orders } from "@/data/catalog";
import { ScreenHead } from "@/components/screen-head";
import { Link, useRouter } from "@/router";
import { cx } from "@/lib/cx";

type Tab = "orders" | "addresses" | "profile";

const tabs: { id: Tab; label: string }[] = [
  { id: "orders", label: "Orders" },
  { id: "addresses", label: "Addresses" },
  { id: "profile", label: "Profile" },
];

export function AccountPage() {
  const { navigate } = useRouter();
  const [tab, setTab] = useState<Tab>("orders");
  const [expanded, setExpanded] = useState<string | null>(orders[0]?.id ?? null);

  return (
    <div className="pb-14">
      <ScreenHead
        title="Account"
        meta={`Signed in as ${account.email}`}
        action={
          <Link
            to="/collections/shop"
            className="text-[13.5px] font-medium text-foreground/70 transition-colors hover:text-foreground"
          >
            Continue shopping →
          </Link>
        }
      />

      <section aria-label="Account details" className="px-[var(--gutter)] pt-7">
        <div className="grid gap-6 lg:grid-cols-[200px_minmax(0,1fr)] lg:gap-10">
          <nav aria-label="Account sections" className="flex flex-row flex-wrap gap-1 lg:flex-col">
            {tabs.map((entry) => (
              <button
                key={entry.id}
                type="button"
                onClick={() => setTab(entry.id)}
                aria-current={tab === entry.id ? "page" : undefined}
                className={cx(
                  "rounded-lg px-2.5 py-2 text-left text-[13px] transition-colors",
                  tab === entry.id
                    ? "bg-white/70 font-medium text-foreground"
                    : "text-foreground/55 hover:text-foreground",
                )}
              >
                {entry.label}
              </button>
            ))}
            <button
              type="button"
              onClick={() => navigate("/")}
              className="rounded-lg px-2.5 py-2 text-left text-[13px] text-foreground/55 transition-colors hover:text-foreground"
            >
              Sign out
            </button>
          </nav>

          {tab === "orders" && (
            <div className="surface rounded-[26px] p-[clamp(16px,2.2vw,26px)]">
              <div className="flex items-baseline justify-between">
                <h2 className="text-[15px] font-medium">Orders</h2>
                <span className="text-[11.5px] text-foreground/45">
                  {orders.length} orders
                </span>
              </div>

              <div className="mt-4 hidden grid-cols-[minmax(0,1fr)_120px_120px_70px_24px] gap-4 border-b border-border pb-2 text-[10px] uppercase tracking-[0.14em] text-foreground/35 sm:grid">
                <span>Order</span>
                <span>Date</span>
                <span>Status</span>
                <span className="text-right">Total</span>
                <span className="sr-only">Expand</span>
              </div>

              <ul>
                {orders.map((order) => {
                  const isOpen = expanded === order.id;
                  return (
                    <li key={order.id} className="border-b border-border">
                      <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4 py-3 sm:grid-cols-[minmax(0,1fr)_120px_120px_70px_24px]">
                        <div>
                          <p className="text-[12.5px] font-medium">#{order.id}</p>
                          <p className="mt-0.5 text-[11px] text-foreground/45">
                            {order.itemCount} {order.itemCount === 1 ? "item" : "items"}
                          </p>
                        </div>
                        <p className="hidden text-[12.5px] text-foreground/60 sm:block">{order.date}</p>
                        <p className="hidden items-center gap-1.5 text-[12px] sm:flex">
                          <span
                            aria-hidden
                            className={cx(
                              "size-1.5 rounded-full",
                              order.status === "Delivered" ? "bg-foreground" : "bg-[#5E90B8]",
                            )}
                          />
                          {order.status}
                        </p>
                        <p className="hidden text-right text-[12.5px] font-medium tabular-nums sm:block">
                          {formatPrice(order.total)}
                        </p>
                        <button
                          type="button"
                          aria-expanded={isOpen}
                          aria-label={`${isOpen ? "Collapse" : "Expand"} order ${order.id}`}
                          onClick={() => setExpanded(isOpen ? null : order.id)}
                          className="hidden size-6 place-items-center rounded-full text-foreground/45 sm:grid"
                        >
                          {isOpen ? (
                            <ChevronUp className="size-4" strokeWidth={1.8} />
                          ) : (
                            <ChevronDown className="size-4" strokeWidth={1.8} />
                          )}
                        </button>
                        <span className="text-[12.5px] font-medium tabular-nums sm:hidden">
                          {formatPrice(order.total)}
                        </span>
                      </div>

                      {isOpen && (
                        <div className="grid gap-6 pb-5 sm:grid-cols-[minmax(0,1fr)_250px]">
                          <ul>
                            {order.items.map((item) => {
                              const product = getProduct(item.slug);
                              return (
                                <li key={`${order.id}-${item.slug}`} className="flex items-start gap-3 py-2">
                                  {product && (
                                    <span className="grid size-14 shrink-0 place-items-center rounded-xl bg-white/60">
                                      <img
                                        src={product.image}
                                        alt=""
                                        className="h-11 w-auto object-contain"
                                      />
                                    </span>
                                  )}
                                  <span className="min-w-0 flex-1">
                                    <span className="block text-[12.5px] font-medium">
                                      {product?.name ?? item.slug}
                                    </span>
                                    <span className="mt-0.5 block text-[11.5px] text-foreground/55">
                                      {item.colour}, size {item.size}
                                    </span>
                                    {product && (
                                      <Link
                                        to={`/products/${product.slug}`}
                                        className="mt-1 inline-block text-[11.5px] underline underline-offset-2 text-foreground/60"
                                      >
                                        View piece
                                      </Link>
                                    )}
                                  </span>
                                  <span className="text-[12.5px] tabular-nums">
                                    {formatPrice(item.price)}
                                  </span>
                                </li>
                              );
                            })}
                          </ul>

                          {order.address && (
                            <div>
                              <p className="text-[10px] uppercase tracking-[0.14em] text-foreground/35">
                                Delivery address
                              </p>
                              <p className="mt-1.5 text-[12px] leading-[1.5] text-foreground/70">
                                {order.address}
                              </p>
                              {order.tracking && (
                                <>
                                  <p className="mt-3 text-[10px] uppercase tracking-[0.14em] text-foreground/35">
                                    Tracking
                                  </p>
                                  <p className="mt-1.5 text-[12px] text-foreground/70">
                                    {order.tracking}
                                  </p>
                                </>
                              )}
                              <button type="button" className="pill pill--glass mt-3 h-9 px-3.5 text-[12px]">
                                <Package className="size-3.5" strokeWidth={1.7} />
                                Track parcel
                              </button>
                            </div>
                          )}
                        </div>
                      )}
                    </li>
                  );
                })}
              </ul>

              <button
                type="button"
                className="mt-4 text-[12.5px] font-medium text-foreground/70 transition-colors hover:text-foreground"
              >
                View all orders →
              </button>
            </div>
          )}

          {tab === "addresses" && (
            <div className="surface rounded-[26px] p-[clamp(16px,2.2vw,26px)]">
              <h2 className="text-[15px] font-medium">Addresses</h2>
              <div className="mt-4 max-w-[360px] border-t border-border pt-4">
                <p className="text-[12.5px] font-medium">{account.name}</p>
                <p className="mt-1 text-[12.5px] leading-[1.5] text-foreground/60">
                  {account.address}
                </p>
                <p className="mt-2 text-[11.5px] text-foreground/40">Default delivery address</p>
              </div>
            </div>
          )}

          {tab === "profile" && (
            <div className="surface rounded-[26px] p-[clamp(16px,2.2vw,26px)]">
              <h2 className="text-[15px] font-medium">Profile</h2>
              <dl className="mt-4 max-w-[420px]">
                <div className="field-row">
                  <dt className="text-[12.5px] text-foreground/55">Name</dt>
                  <dd className="text-[13px]">{account.name}</dd>
                </div>
                <div className="field-row">
                  <dt className="text-[12.5px] text-foreground/55">Email</dt>
                  <dd className="text-[13px]">{account.email}</dd>
                </div>
                <div className="field-row">
                  <dt className="text-[12.5px] text-foreground/55">Currency</dt>
                  <dd className="text-[13px]">USD $ · United States</dd>
                </div>
              </dl>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
