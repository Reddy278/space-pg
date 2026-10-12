import { test, expect } from "@playwright/test";

test("Space PG frontend should open successfully", async ({ page }) => {
    await page.goto("/");

    await expect(page.locator("body")).toBeVisible();
});