import { SiteFooter } from "@/components/site-footer";
import { SiteNav } from "@/components/site-nav";
import { HomePage } from "@/pages/home";
import { ShopPage } from "@/pages/shop";
import { ProductPage } from "@/pages/product";
import { LookPage } from "@/pages/look";
import { LookbookPage } from "@/pages/lookbook";
import { SearchPage } from "@/pages/search";
import { BagPage } from "@/pages/bag";
import { CheckoutPage } from "@/pages/checkout";
import { AccountPage } from "@/pages/account";
import { InfoPage } from "@/pages/info";
import { RouterProvider, useRouter } from "@/router";
import { CartProvider } from "@/store/cart";

function Screen({ pathname }: { pathname: string }) {
  if (pathname === "/") return <HomePage />;
  if (pathname === "/collections" || pathname === "/collections/shop") return <ShopPage />;

  const collection = pathname.match(/^\/collections\/([^/]+)$/);
  if (collection) return <ShopPage key={collection[1]} category={collection[1]} />;

  const product = pathname.match(/^\/products\/([^/]+)$/);
  if (product) return <ProductPage key={product[1]} slug={product[1]} />;

  const look = pathname.match(/^\/looks\/([^/]+)$/);
  if (look) return <LookPage key={look[1]} slug={look[1]} />;

  if (pathname === "/lookbook") return <LookbookPage />;
  if (pathname === "/search") return <SearchPage />;
  if (pathname === "/bag") return <BagPage />;
  if (pathname === "/checkout") return <CheckoutPage />;
  if (pathname === "/account") return <AccountPage />;

  return <InfoPage path={pathname} />;
}

function Shell() {
  const { pathname } = useRouter();

  if (pathname === "/search") {
    return (
      <main id="main">
        <SearchPage />
      </main>
    );
  }

  return (
    <div className="min-h-svh bg-transparent">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-100 focus:rounded-full focus:bg-foreground focus:px-4 focus:py-2 focus:text-sm focus:text-primary-foreground"
      >
        Skip to content
      </a>
      <SiteNav />
      <main id="main">
        <Screen pathname={pathname} />
      </main>
      <SiteFooter />
    </div>
  );
}

export function App() {
  return (
    <CartProvider>
      <RouterProvider>
        <Shell />
      </RouterProvider>
    </CartProvider>
  );
}

export default App;
