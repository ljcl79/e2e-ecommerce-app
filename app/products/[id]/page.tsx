"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";
import { fetchProduct, type Product } from "@/lib/fakestore";

export default function ProductDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const { addToCart } = useCart();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        setLoading(true);
        setError(null);
        const data = await fetchProduct(params.id);
        if (!cancelled) {
          setProduct(data);
        }
      } catch (err) {
        if (!cancelled) {
          setError(
            err instanceof Error ? err.message : "Error al cargar el producto",
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
  }, [params.id]);

  function handleAddToCart() {
    if (!product || !isAuthenticated) return;
    addToCart({
      id: product.id,
      title: product.title,
      price: product.price,
    });
  }

  function handleBuy() {
    if (!product || !isAuthenticated) return;
    addToCart({
      id: product.id,
      title: product.title,
      price: product.price,
    });
    router.push("/cart");
  }

  return (
    <main className="mx-auto max-w-3xl px-4 py-10">
      <Link href="/" className="mb-4 inline-block text-sm text-slate-600 underline">
        Volver al listado
      </Link>

      {loading ? (
        <p id="products-loading" className="text-slate-600">
          Cargando producto...
        </p>
      ) : null}

      {error ? (
        <p id="products-error" className="text-red-600" role="alert">
          {error}
        </p>
      ) : null}

      {product && !loading && !error ? (
        <article id="product-detail" className="space-y-4">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={product.image}
            alt={product.title}
            className="mx-auto h-64 object-contain"
          />
          <h1 id="product-title" className="text-2xl font-bold text-slate-900">
            {product.title}
          </h1>
          <p id="product-price" className="text-xl font-semibold">
            ${product.price.toFixed(2)}
          </p>
          <p className="text-slate-700">{product.description}</p>
          <p className="text-sm text-slate-500">Categoría: {product.category}</p>

          <div className="flex flex-wrap gap-3 pt-2">
            <button
              id="add-to-cart-btn"
              type="button"
              disabled={!isAuthenticated}
              onClick={handleAddToCart}
              className="rounded bg-slate-900 px-4 py-2 text-white hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Agregar al carrito
            </button>
            <button
              id="buy-btn"
              type="button"
              disabled={!isAuthenticated}
              onClick={handleBuy}
              className="rounded border border-slate-900 px-4 py-2 text-slate-900 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Comprar
            </button>
            <a
              id="download-ficha-btn"
              href={`/api/products/${product.id}/ficha`}
              className="rounded border border-slate-300 px-4 py-2 text-slate-800 hover:bg-slate-50"
            >
              Descargar ficha PDF
            </a>
          </div>
        </article>
      ) : null}
    </main>
  );
}
