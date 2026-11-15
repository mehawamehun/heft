import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { Product } from "@/data/catalog";

export type CartLine = {
  key: string;
  slug: string;
  name: string;
  colour: string;
  size: string;
  price: number;
  qty: number;
  image: string;
};

type CartValue = {
  lines: CartLine[];
  itemCount: number;
  subtotal: number;
  delivery: number;
  tax: number;
  total: number;
  add: (product: Product, size: string, colour?: string) => void;
  setQty: (key: string, qty: number) => void;
  remove: (key: string) => void;
};

const CartContext = createContext<CartValue | null>(null);

const lineKey = (slug: string, colour: string, size: string) => `${slug}|${colour}|${size}`;

const seedLines: CartLine[] = [
  {
    key: lineKey("heavyweight-fleece-hoodie", "Charcoal", "M"),
    slug: "heavyweight-fleece-hoodie",
    name: "Heavyweight Fleece Hoodie",
    colour: "Charcoal",
    size: "M",
    price: 168,
    qty: 1,
    image: "/assets/heft/garments/hoodie-charcoal.webp",
  },
  {
    key: lineKey("wide-leg-jean-indigo", "Washed indigo", "32"),
    slug: "wide-leg-jean-indigo",
    name: "Wide Leg Jeans",
    colour: "Washed indigo",
    size: "32",
    price: 198,
    qty: 1,
    image: "/assets/heft/garments/jean-indigo.webp",
  },
  {
    key: lineKey("raglan-sweatshirt", "Cream", "M"),
    slug: "raglan-sweatshirt",
    name: "Raglan Sweatshirt",
    colour: "Cream",
    size: "M",
    price: 148,
    qty: 1,
    image: "/assets/heft/garments/sweatshirt-cream.webp",
  },
];

export function CartProvider({ children }: { children: ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>(seedLines);

  const add = useCallback((product: Product, size: string, colour?: string) => {
    const chosenColour = colour ?? product.colour;
    const key = lineKey(product.slug, chosenColour, size);
    setLines((current) => {
      const existing = current.find((line) => line.key === key);
      if (existing) {
        return current.map((line) =>
          line.key === key ? { ...line, qty: Math.min(line.qty + 1, 9) } : line,
        );
      }
      return [
        ...current,
        {
          key,
          slug: product.slug,
          name: product.name,
          colour: chosenColour,
          size,
          price: product.price,
          qty: 1,
          image: product.image,
        },
      ];
    });
  }, []);

  const setQty = useCallback((key: string, qty: number) => {
    setLines((current) =>
      qty <= 0
        ? current.filter((line) => line.key !== key)
        : current.map((line) => (line.key === key ? { ...line, qty: Math.min(qty, 9) } : line)),
    );
  }, []);

  const remove = useCallback((key: string) => {
    setLines((current) => current.filter((line) => line.key !== key));
  }, []);

  const value = useMemo<CartValue>(() => {
    const subtotal = lines.reduce((sum, line) => sum + line.price * line.qty, 0);
    const delivery = subtotal === 0 || subtotal >= 250 ? 0 : 12;
    const tax = Math.round(subtotal * 0.08 * 100) / 100;
    const itemCount = lines.reduce((sum, line) => sum + line.qty, 0);
    return {
      lines,
      itemCount,
      subtotal,
      delivery,
      tax,
      total: subtotal + delivery + tax,
      add,
      setQty,
      remove,
    };
  }, [lines, add, setQty, remove]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used inside CartProvider");
  }
  return context;
}
