import { expect, test } from "@playwright/test";
import { LoginPage } from "./pages/LoginPage";
import { RegisterPage } from "./pages/RegisterPage";

test.describe("Auth POM", () => {
  test("registro → logout → login", async ({ page }) => {
    const email = `user-${Date.now()}@example.com`;
    const password = "Test1234!";

    const registerPage = new RegisterPage(page);
    await registerPage.register(email, password);

    await expect(page).toHaveURL("/");
    await expect(page.locator("#nav-user")).toHaveText(email);
    await expect(page.locator("#nav-logout")).toBeVisible();

    await page.locator("#nav-logout").click();
    await expect(page.locator("#nav-login")).toBeVisible();
    await expect(page.locator("#nav-register")).toBeVisible();
    await expect(page.locator("#nav-user")).toHaveCount(0);

    const loginPage = new LoginPage(page);
    await loginPage.login(email, password);

    await expect(page).toHaveURL("/");
    await expect(page.locator("#nav-user")).toHaveText(email);
    await expect(page.locator("#nav-logout")).toBeVisible();
  });
});
