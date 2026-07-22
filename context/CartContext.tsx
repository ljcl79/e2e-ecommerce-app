"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";

export type CartItem = {
  id: number;
  title: string;
  price: number;
  quantity: number;
};

type CartContextValue = {
  items: CartItem[];
  total: number;
  purchaseSuccess: boolean;
  addToCart: (product: { id: number; title: string; price: number }) => void;
  buy: () => void;
  clearPurchaseSuccess: () => void;
};

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [purchaseSuccess, setPurchaseSuccess] = useState(false);

  const addToCart = useCallback(
    (product: { id: number; title: string; price: number }) => {
      setPurchaseSuccess(false);
      setItems((current) => {
        const existing = current.find((item) => item.id === product.id);
        if (existing) {
          return current.map((item) =>
            item.id === product.id
              ? { ...item, quantity: item.quantity + 1 }
              : item,
          );
        }
        return [...current, { ...product, quantity: 1 }];
      });
    },
    [],
  );

  const buy = useCallback(() => {
    if (items.length === 0) return;
    setItems([]);
    setPurchaseSuccess(true);
  }, [items.length]);

  const clearPurchaseSuccess = useCallback(() => {
    setPurchaseSuccess(false);
  }, []);

  const total = useMemo(
    () => items.reduce((sum, item) => sum + item.price * item.quantity, 0),
    [items],
  );

  const value = useMemo(
    () => ({
      items,
      total,
      purchaseSuccess,
      addToCart,
      buy,
      clearPurchaseSuccess,
    }),
    [items, total, purchaseSuccess, addToCart, buy, clearPurchaseSuccess],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart debe usarse dentro de CartProvider");
  }
  return context;
}
