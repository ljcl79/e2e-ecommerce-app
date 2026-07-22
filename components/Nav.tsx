"use client";

import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";

export function Nav() {
  const { isAuthenticated, userEmail, logout, isReady } = useAuth();
  const { items } = useCart();
  const cartCount = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <header className="border-b border-slate-200 bg-white">
      <nav className="mx-auto flex max-w-5xl flex-wrap items-center gap-4 px-4 py-3">
        <Link
          id="nav-home"
          href="/"
          className="font-semibold text-slate-900 hover:text-slate-600"
        >
          Productos
        </Link>
        <Link
          id="nav-iframe"
          href="/iframe"
          className="text-slate-700 hover:text-slate-900"
        >
          Iframe
        </Link>
        <Link
          id="nav-cart"
          href="/cart"
          className="text-slate-700 hover:text-slate-900"
        >
          Carrito{cartCount > 0 ? ` (${cartCount})` : ""}
        </Link>
        <div className="ml-auto flex flex-wrap items-center gap-3">
          {isReady && isAuthenticated ? (
            <>
              <span id="nav-user" className="text-sm text-slate-600">
                {userEmail}
              </span>
              <button
                id="nav-logout"
                type="button"
                onClick={logout}
                className="rounded border border-slate-300 px-3 py-1 text-sm hover:bg-slate-50"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                id="nav-login"
                href="/login"
                className="rounded border border-slate-300 px-3 py-1 text-sm hover:bg-slate-50"
              >
                Login
              </Link>
              <Link
                id="nav-register"
                href="/register"
                className="rounded bg-slate-900 px-3 py-1 text-sm text-white hover:bg-slate-700"
              >
                Registro
              </Link>
            </>
          )}
        </div>
      </nav>
    </header>
  );
}
