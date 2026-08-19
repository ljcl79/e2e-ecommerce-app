import { expect, test } from "@playwright/test";

test.describe("Download", () => {
  test("descarga fichaProducto.pdf desde el detalle", async ({ page }) => {
    await page.route("**/fakestoreapi.com/products/1", async (route) => {
      await route.fulfill({
        status: 200,
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: 1,
          title: "Producto PDF Demo",
          price: 29.5,
          description: "Descripción para ficha PDF",
          category: "demo",
          image: "https://fakestoreapi.com/img/81fPKd-2AYL._AC_SL1500_t.png",
        }),
      });
    });

    await page.route("**/api/products/1/ficha**", async (route) => {
      await route.fulfill({
        status: 200,
        headers: {
          "Content-Type": "application/pdf",
          "Content-Disposition": 'attachment; filename="fichaProducto.pdf"',
        },
        body: Buffer.from("%PDF-1.4 mock ficha"),
      });
    });

    await page.goto("/products/1");
    await expect(page.locator("#product-detail")).toBeVisible({
      timeout: 15_000,
    });

    const downloadPromise = page.waitForEvent("download");
    await page.locator("#download-ficha-btn").click();
    const download = await downloadPromise;

    expect(download.suggestedFilename()).toBe("fichaProducto.pdf");
    expect(await download.failure()).toBeNull();
  });
});
