import { expect, test } from "@playwright/test";

test.describe("API mock", () => {
  test("muestra productos mockeados de Fake Store", async ({ page }) => {
    await page.route("**/fakestoreapi.com/**", async (route) => {
      const url = route.request().url();

      if (/\/products\/\d+/.test(url)) {
        await route.continue();
        return;
      }

      if (url.includes("/products")) {
        await route.fulfill({
          status: 200,
          headers: {
            "Access-Control-Allow-Origin": "*",
            "Content-Type": "application/json",
          },
          body: JSON.stringify([
            {
              id: 101,
              title: "Producto Mock Playwright",
              price: 19.99,
              description: "Producto de prueba para API mocks",
              category: "testing",
              image:
                "https://fakestoreapi.com/img/81fPKd-2AYL._AC_SL1500_t.png",
            },
          ]),
        });
        return;
      }

      await route.continue();
    });

    await page.goto("/");
    await expect(page.locator("#products-list")).toBeVisible({
      timeout: 15_000,
    });
    await expect(page.locator("#product-card-101")).toBeVisible();
    await expect(page.locator("#product-card-101")).toContainText(
      "Producto Mock Playwright",
    );
  });
});
