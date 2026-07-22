import { expect, test } from "@playwright/test";

test.describe("Iframe", () => {
  test("interactúa con elementos dentro del iframe", async ({ page }) => {
    await page.goto("/iframe");

    const frame = page.frameLocator("#practice-iframe");
    await expect(frame.locator("#iframe-title")).toHaveText(
      "Contenido del iframe",
    );

    const emailInput = frame.locator("#iframe-email-input");
    await emailInput.click();
    await emailInput.fill("alumno@test.com");
    await expect(emailInput).toHaveValue("alumno@test.com");
    await frame.locator("#iframe-submit-btn").click();

    await expect(frame.locator("#iframe-message")).toHaveText(
      "Email recibido: alumno@test.com",
    );
  });
});
