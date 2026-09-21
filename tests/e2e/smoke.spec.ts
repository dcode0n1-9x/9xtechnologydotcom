import { expect, test } from "@playwright/test";

const WIDTHS = [360, 370, 390, 414, 430];

test("first session: intro → logo flight → card → copy → vCard", async ({ page }) => {
  await page.goto("/");

  // Preloader appears on first session, then the curtains open.
  const preloader = page.locator(".lux-preloader");
  await expect(preloader).toBeVisible();
  await expect(page.locator(".lux-preloader.curtains-open")).toBeAttached();

  // Hero revealed and the overlay is gone.
  await expect(page.locator(".lux-hero-target.revealed").first()).toBeVisible();
  await expect(preloader).toHaveCount(0);

  // Logo landed: the permanent AppBar mark is visible again.
  await expect(page.locator("html")).not.toHaveClass(/lux-active/);
  await expect(page.locator("#header-brand-logo-mark svg")).toHaveCSS("opacity", "1");

  // Digital Card is visible.
  await expect(page.getByRole("heading", { name: "Hemant" })).toBeVisible();
  await expect(page.getByText("CTO @ 9xTechnology")).toBeVisible();

  // Copy credentials → toast.
  await page.getByRole("button", { name: "Copy credentials" }).click();
  await expect(page.getByRole("status").filter({ hasText: "Credentials copied" })).toBeVisible();
  const clipboard = await page.evaluate(() => navigator.clipboard.readText());
  // Windows clipboards store CRLF.
  expect(clipboard.replace(/\r\n/g, "\n")).toBe(
    "Account: 77777\nPassword: e2e-demo-pass\nServer: 9xTechnology-Demo01",
  );

  // vCard download attributes.
  const save = page.getByRole("link", { name: "Save Contact" });
  await expect(save).toHaveAttribute("download", "Hemant-9xTechnology.vcf");
  await expect(save).toHaveAttribute("href", "/hemant.vcf");
  const vcf = await page.request.get("/hemant.vcf");
  expect(vcf.headers()["content-type"]).toContain("text/vcard");
});

test("intro is skipped on repeat visits in the same session", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator(".lux-preloader")).toHaveCount(0, { timeout: 10_000 });
  await page.reload();
  await expect(page.locator("html")).toHaveClass(/lux-skip/);
  await expect(page.locator(".lux-preloader")).toHaveCount(0);
});

test("?intro=1 forces the intro", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator(".lux-preloader")).toHaveCount(0, { timeout: 10_000 });
  await page.goto("/?intro=1");
  await expect(page.locator(".lux-preloader")).toBeVisible();
});

test.describe("reduced motion", () => {
  test.use({ reducedMotion: "reduce" });

  test("skips the cinematic intro and reveals immediately", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator(".lux-preloader")).toHaveCount(0);
    await expect(page.getByRole("heading", { name: "Hemant" })).toBeVisible();
  });
});

for (const width of WIDTHS) {
  test(`no horizontal overflow at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 844 });
    await page.goto("/");
    await expect(page.locator(".lux-preloader")).toHaveCount(0, { timeout: 10_000 });
    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
    );
    expect(overflow).toBe(0);
  });
}
