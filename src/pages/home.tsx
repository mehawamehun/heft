import { HeroCarousel } from "@/components/hero-carousel";
import { HomeShop } from "@/sections/home-shop";
import { OnTheRail } from "@/sections/on-the-rail";
import { LooksGrid } from "@/sections/looks-grid";

export function HomePage() {
  return (
    <div className="pb-2">
      <HeroCarousel />
      <HomeShop />
      <OnTheRail />
      <LooksGrid />
    </div>
  );
}
