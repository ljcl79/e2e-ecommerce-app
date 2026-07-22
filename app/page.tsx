"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { fetchProducts, type Product } from "@/lib/fakestore";

export default function HomePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        setLoading(true);
        setError(null);
        const data = await fetchProducts();
        if (!cancelled) {
          setProducts(data);
        }
      } catch (err) {
        if (!cancelled) {
          setError(
            err instanceof Error ? err.message : "Error al cargar productos",
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    void load();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <main className="mx-auto max-w-5xl px-4 py-10">
      <h1 className="mb-6 text-2xl font-bold text-slate-900">Productos</h1>

      {loading ? (
        <p id="products-loading" className="text-slate-600">
          Cargando productos...
        </p>
      ) : null}

      {error ? (
        <p id="products-error" className="text-red-600" role="alert">
          {error}
        </p>
      ) : null}

      {!loading && !error ? (
        <ul
          id="products-list"
          className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
        >
          {products.map((product) => (
            <li
              key={product.id}
              id={`product-card-${product.id}`}
              className="rounded border border-slate-200 bg-white p-4 shadow-sm"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={product.image}
                alt={product.title}
                className="mb-3 h-40 w-full object-contain"
              />
              <h2 className="mb-2 line-clamp-2 font-semibold text-slate-900">
                {product.title}
              </h2>
              <p className="mb-3 font-bold text-slate-800">
                ${product.price.toFixed(2)}
              </p>
              <Link
                href={`/products/${product.id}`}
                className="inline-block rounded bg-slate-900 px-3 py-1.5 text-sm text-white hover:bg-slate-700"
              >
                Ver detalle
              </Link>
            </li>
          ))}
        </ul>
      ) : null}
    </main>
  );
}
