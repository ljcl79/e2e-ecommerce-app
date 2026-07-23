import { expect, test, type Page } from "@playwright/test";

async function mockProductsList(
  page: Page,
  options: { status: number; body?: unknown },
) {
  await page.route("**/fakestoreapi.com/**", async (route) => {
    const url = route.request().url();

    if (/\/products\/\d+/.test(url)) {
      await route.continue();
      return;
    }

    if (url.includes("/products")) {
      await route.fulfill({
        status: options.status,
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Content-Type": "application/json",
        },
        body:
          options.body !== undefined
            ? JSON.stringify(options.body)
            : JSON.stringify({ message: "Error simulado" }),
      });
      return;
    }

    await route.continue();
  });
}

test.describe("API mock", () => {
  test("muestra productos mockeados de Fake Store", async ({ page }) => {
    await mockProductsList(page, {
      status: 200,
      body: [
        {
          id: 101,
          title: "Producto Mock Playwright",
          price: 19.99,
          description: "Producto de prueba para API mocks",
          category: "testing",
          image: "https://fakestoreapi.com/img/81fPKd-2AYL._AC_SL1500_t.png",
        },
      ],
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

  test("muestra error cuando la API responde 404", async ({ page }) => {
    await mockProductsList(page, {
      status: 404,
      body: { message: "Not Found" },
    });

    await page.goto("/");
    await expect(page.locator("#products-error")).toBeVisible({
      timeout: 15_000,
    });
    await expect(page.locator("#products-error")).toContainText(
      "No se pudieron cargar los productos",
    );
    await expect(page.locator("#products-list")).toHaveCount(0);
  });

  test("muestra error cuando la API responde 500", async ({ page }) => {
    await mockProductsList(page, {
      status: 500,
      body: { message: "Internal Server Error" },
    });

    await page.goto("/");
    await expect(page.locator("#products-error")).toBeVisible({
      timeout: 15_000,
    });
    await expect(page.locator("#products-error")).toContainText(
      "Error general de la aplicación",
    );
    await expect(page.locator("#products-list")).toHaveCount(0);
  });

  test("mock con fulfill y json muestra un producto de curso", async ({
    page,
  }) => {
    await page.route("**/fakestoreapi.com/products", async (route) => {
      await route.fulfill({
        status: 200,
        headers: {
          "Access-Control-Allow-Origin": "*",
        },
        json: [
          {
            id: 202,
            title: "Curso Playwright Mock JSON",
            price: 42,
            description: "Mock usando la opción json de fulfill",
            category: "education",
            image:
              "https://fakestoreapi.com/img/81fPKd-2AYL._AC_SL1500_t.png",
          },
        ],
      });
    });

    await page.goto("/");
    await expect(page.locator("#products-list")).toBeVisible({
      timeout: 15_000,
    });
    await expect(page.locator("#product-card-202")).toBeVisible();
    await expect(page.locator("#product-card-202")).toContainText(
      "Curso Playwright Mock JSON",
    );
  });

  test("muestra error cuando la API responde 403", async ({ page }) => {
    await mockProductsList(page, {
      status: 403,
      body: { message: "Forbidden" },
    });

    await page.goto("/");
    await expect(page.locator("#products-error")).toBeVisible({
      timeout: 15_000,
    });
    await expect(page.locator("#products-error")).toHaveText(
      "Se intentó acceso no autorizado",
    );
    await expect(page.locator("#products-list")).toHaveCount(0);
  });

  test("muestra mensaje cuando la API responde lista vacía", async ({
    page,
  }) => {
    await mockProductsList(page, {
      status: 200,
      body: [],
    });

    await page.goto("/");
    await expect(page.locator("#products-empty")).toBeVisible({
      timeout: 15_000,
    });
    await expect(page.locator("#products-empty")).toHaveText(
      "No hay productos disponibles",
    );
    await expect(page.locator("#products-list")).toHaveCount(0);
  });
});
