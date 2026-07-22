"use client";

import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";

export default function CartPage() {
  const { isAuthenticated } = useAuth();
  const { items, total, buy, purchaseSuccess } = useCart();

  return (
    <main className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="mb-6 text-2xl font-bold text-slate-900">Carrito</h1>

      {purchaseSuccess ? (
        <p
          id="purchase-success"
          className="mb-4 rounded border border-green-300 bg-green-50 px-4 py-3 text-green-800"
          role="status"
        >
          Compra exitosa
        </p>
      ) : null}

      {!isAuthenticated ? (
        <p className="mb-4 text-slate-600">
          Debes{" "}
          <Link id="cart-login-link" href="/login" className="underline">
            iniciar sesión
          </Link>{" "}
          para comprar.
        </p>
      ) : null}

      {items.length === 0 && !purchaseSuccess ? (
        <p className="text-slate-600">El carrito está vacío.</p>
      ) : null}

      {items.length > 0 ? (
        <>
          <ul id="cart-list" className="space-y-3">
            {items.map((item) => (
              <li
                key={item.id}
                id={`cart-item-${item.id}`}
                className="flex items-center justify-between rounded border border-slate-200 px-4 py-3"
              >
                <div>
                  <p className="font-medium">{item.title}</p>
                  <p className="text-sm text-slate-600">
                    Cantidad: {item.quantity}
                  </p>
                </div>
                <p className="font-semibold">
                  ${(item.price * item.quantity).toFixed(2)}
                </p>
              </li>
            ))}
          </ul>
          <p id="cart-total" className="mt-4 text-lg font-bold">
            Total: ${total.toFixed(2)}
          </p>
          <button
            id="cart-buy-btn"
            type="button"
            disabled={!isAuthenticated}
            onClick={buy}
            className="mt-4 rounded bg-slate-900 px-4 py-2 text-white hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Comprar
          </button>
        </>
      ) : null}
    </main>
  );
}
