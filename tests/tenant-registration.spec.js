
import { test, expect } from "@playwright/test";

const mockRooms = [
    {
        roomNumber: "G-03",
        floor: "Ground Floor",
        capacity: 2,
        beds: [
            { bedNumber: 1, status: "available" },
            { bedNumber: 2, status: "available" },
        ],
    },
];

test.beforeEach(async ({ page }) => {
    // Mock room availability so the tests do not require a running backend.
    await page.route("**/api/rooms**", async (route) => {
        await route.fulfill({
            status: 200,
            contentType: "application/json",
            body: JSON.stringify({
                success: true,
                rooms: mockRooms,
            }),
        });
    });
});

test("Tenant registration page should open successfully", async ({ page }) => {
    await page.goto("/register");

    await expect(
        page.getByRole("heading", { name: "Resident Registration" })
    ).toBeVisible();

    await expect(page.locator('input[name="name"]')).toBeVisible();
    await expect(page.locator('input[name="mobile"]')).toBeVisible();
    await expect(
        page.locator('input[name="alternateNumber"]')
    ).toBeVisible();

    await expect(
        page.getByRole("button", { name: /Complete Registration/ })
    ).toBeVisible();
});

test("Alternate mobile number should be optional", async ({ page }) => {
    await page.goto("/register");

    const alternateNumber = page.locator(
        'input[name="alternateNumber"]'
    );

    await expect(alternateNumber).toBeVisible();
    await expect(alternateNumber).not.toHaveAttribute("required", "");

    await expect(
        alternateNumber
    ).toHaveAttribute("placeholder", "Alternate number (optional)");

    await expect(alternateNumber).toHaveValue("");
});

test("Required fields should prevent an empty form submission", async ({ page }) => {
    await page.goto("/register");

    const nameInput = page.locator('input[name="name"]');

    await expect(nameInput).toHaveAttribute("required", "");

    await page.getByRole("button", {
        name: /Complete Registration/,
    }).click();

    // The browser should block submission because the name is required.
    expect(
        await nameInput.evaluate((element) => element.checkValidity())
    ).toBe(false);
});

test("Selecting a room should show available beds and automatic rent", async ({ page }) => {
    await page.goto("/register");

    await page.locator('select[name="roomNumber"]').selectOption("G-03");

    await expect(
        page.locator('select[name="bedNumber"]')
    ).toBeEnabled();

    await expect(
        page.locator('select[name="bedNumber"] option')
    ).toHaveCount(3);

    await expect(
        page.locator(".automatic-rent-box")
    ).toContainText("8,000");
});

test("Registration should succeed without an alternate number", async ({ page }) => {
    let submittedBody = "";

    await page.route("**/api/tenants/register", async (route) => {
        submittedBody = route.request().postData() || "";

        await route.fulfill({
            status: 201,
            contentType: "application/json",
            body: JSON.stringify({
                success: true,
                message: "Tenant registered successfully",
                tenant: {
                    name: "Test Tenant",
                    mobile: "9876543210",
                    alternateNumber: "",
                    roomNumber: "G-03",
                    bedNumber: 1,
                    monthlyRent: 8000,
                },
            }),
        });
    });

    // Accept the success alert displayed by the actual component.
    page.once("dialog", async (dialog) => {
        await dialog.accept();
    });

    await page.goto("/register");

    await page.locator('input[name="name"]').fill("Test Tenant");
    await page.locator('input[name="mobile"]').fill("9876543210");

    // Leave alternateNumber empty intentionally.
    await expect(
        page.locator('input[name="alternateNumber"]')
    ).toHaveValue("");

    await page.locator('select[name="roomNumber"]').selectOption("G-03");
    await page.locator('select[name="bedNumber"]').selectOption("1");

    await page.locator('input[name="joinedDate"]').fill("2026-10-01");

    await page.locator('input[type="file"]').setInputFiles({
        name: "test-aadhaar.png",
        mimeType: "image/png",
        buffer: Buffer.from("fake test image"),
    });

    await page.getByRole("button", {
        name: /Complete Registration/,
    }).click();

    await expect(page).toHaveURL(/\/$/);

    expect(submittedBody).toContain("alternateNumber");
    expect(submittedBody).toContain("Test Tenant");
    expect(submittedBody).toContain("9876543210");
});