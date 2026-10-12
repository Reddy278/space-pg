import { test, expect } from "@playwright/test";

test.beforeEach(async ({ page }) => {
    // Mock room data so tests do not depend on the backend.
    await page.route("**/api/rooms**", async (route) => {
        await route.fulfill({
            status: 200,
            contentType: "application/json",
            body: JSON.stringify({
                success: true,
                rooms: [],
            }),
        });
    });
});

test("Admin login page should open successfully", async ({ page }) => {
    await page.goto("/admin");

    await expect(
        page.getByRole("heading", { name: "Welcome Back" })
    ).toBeVisible();

    await expect(
        page.getByPlaceholder("Enter username")
    ).toBeVisible();

    await expect(
        page.getByPlaceholder("Enter password")
    ).toBeVisible();

    await expect(
        page.getByRole("button", { name: /Login to Dashboard/ })
    ).toBeVisible();
});

test("Login form should require username and password", async ({ page }) => {
    await page.goto("/admin");

    const username = page.getByPlaceholder("Enter username");
    const password = page.getByPlaceholder("Enter password");

    await expect(username).toHaveAttribute("required", "");
    await expect(password).toHaveAttribute("required", "");

    await page.getByRole("button", {
        name: /Login to Dashboard/,
    }).click();

    // Browser validation should prevent submission.
    expect(
        await username.evaluate((element) => element.checkValidity())
    ).toBe(false);
});

test("Invalid credentials should display an error", async ({ page }) => {
    await page.route("**/api/auth/login", async (route) => {
        await route.fulfill({
            status: 401,
            contentType: "application/json",
            body: JSON.stringify({
                success: false,
                message: "Invalid username or password",
            }),
        });
    });

    await page.goto("/admin");

    await page.getByPlaceholder("Enter username").fill("wrongadmin");
    await page.getByPlaceholder("Enter password").fill("wrongpassword");

    await page.getByRole("button", {
        name: /Login to Dashboard/,
    }).click();

    await expect(page.locator(".form-error")).toContainText(
        "Invalid username or password"
    );

    await expect(page).toHaveURL(/\/admin$/);
});

test("Successful login should save token and open dashboard", async ({ page }) => {
    await page.route("**/api/auth/login", async (route) => {
        await route.fulfill({
            status: 200,
            contentType: "application/json",
            body: JSON.stringify({
                success: true,
                token: "playwright-test-token",
            }),
        });
    });

    // Mock the authenticated dashboard's tenant request.
    await page.route("**/api/tenants", async (route) => {
        if (route.request().method() === "GET") {
            await route.fulfill({
                status: 200,
                contentType: "application/json",
                body: JSON.stringify({
                    success: true,
                    tenants: [],
                }),
            });
        } else {
            await route.continue();
        }
    });

    await page.goto("/admin");

    await page.getByPlaceholder("Enter username").fill("testadmin");
    await page.getByPlaceholder("Enter password").fill("testpassword");

    await page.getByRole("button", {
        name: /Login to Dashboard/,
    }).click();

    await expect(page).toHaveURL(/\/admin\/dashboard$/);

    await expect(
        page.getByRole("heading", { name: "Space PG Dashboard" })
    ).toBeVisible();

    const token = await page.evaluate(() =>
        localStorage.getItem("space_pg_token")
    );

    expect(token).toBe("playwright-test-token");
});