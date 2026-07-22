export const FAKESTORE_BASE_URL = "https://fakestoreapi.com";

export type Product = {
  id: number;
  title: string;
  price: number;
  description: string;
  category: string;
  image: string;
  rating?: {
    rate: number;
    count: number;
  };
};

export async function fetchProducts(): Promise<Product[]> {
  const response = await fetch(`${FAKESTORE_BASE_URL}/products`);
  if (!response.ok) {
    throw new Error("No se pudieron cargar los productos");
  }
  return response.json();
}

export async function fetchProduct(id: string | number): Promise<Product> {
  const response = await fetch(`${FAKESTORE_BASE_URL}/products/${id}`);
  if (!response.ok) {
    throw new Error("No se pudo cargar el producto");
  }
  return response.json();
}

/** URL de descarga PDF con datos del producto (evita fetch server→Fake Store en Vercel). */
export function buildFichaDownloadUrl(product: Product): string {
  const params = new URLSearchParams({
    title: product.title,
    price: String(product.price),
    description: product.description,
    category: product.category,
  });
  return `/api/products/${product.id}/ficha?${params.toString()}`;
}
