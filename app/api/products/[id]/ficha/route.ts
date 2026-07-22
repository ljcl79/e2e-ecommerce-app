import PDFDocument from "pdfkit";
import { FAKESTORE_BASE_URL, type Product } from "@/lib/fakestore";

export const runtime = "nodejs";

function buildPdfBuffer(product: Product): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ margin: 50 });
    const chunks: Buffer[] = [];

    doc.on("data", (chunk: Buffer) => chunks.push(chunk));
    doc.on("end", () => resolve(Buffer.concat(chunks)));
    doc.on("error", reject);

    doc.fontSize(18).text("Ficha de producto", { underline: true });
    doc.moveDown();
    doc.fontSize(14).text(`ID: ${product.id}`);
    doc.text(`Nombre: ${product.title}`);
    doc.text(`Precio: $${product.price.toFixed(2)}`);
    doc.text(`Categoría: ${product.category}`);
    doc.moveDown();
    doc.fontSize(12).text("Descripción:");
    doc.text(product.description, { align: "justify" });
    doc.end();
  });
}

function productFromSearchParams(
  id: string,
  searchParams: URLSearchParams,
): Product | null {
  const title = searchParams.get("title");
  const priceRaw = searchParams.get("price");
  const description = searchParams.get("description");
  const category = searchParams.get("category");

  if (!title || !priceRaw || !description || !category) {
    return null;
  }

  const price = Number(priceRaw);
  if (Number.isNaN(price)) {
    return null;
  }

  return {
    id: Number(id) || 0,
    title,
    price,
    description,
    category,
    image: searchParams.get("image") ?? "",
  };
}

async function fetchProductFromApi(id: string): Promise<Product | null> {
  const response = await fetch(`${FAKESTORE_BASE_URL}/products/${id}`, {
    cache: "no-store",
  });

  if (!response.ok) {
    return null;
  }

  return (await response.json()) as Product;
}

export async function GET(
  request: Request,
  context: { params: Promise<{ id: string }> },
) {
  const { id } = await context.params;

  try {
    const { searchParams } = new URL(request.url);
    const product =
      productFromSearchParams(id, searchParams) ??
      (await fetchProductFromApi(id));

    if (!product) {
      return new Response("Producto no encontrado", { status: 404 });
    }

    const pdfBuffer = await buildPdfBuffer(product);

    return new Response(new Uint8Array(pdfBuffer), {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": 'attachment; filename="fichaProducto.pdf"',
        "Cache-Control": "no-store",
      },
    });
  } catch (error) {
    console.error("[ficha PDF]", error);
    return new Response("Error al generar la ficha", { status: 500 });
  }
}
