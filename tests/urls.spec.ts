import { expect, test as base } from "@playwright/test";
import { parse } from "csv-parse/sync";
import fs from "fs";
import path from "path";

const test = base.extend({
  page: async ({ baseURL, page }, use) => {
    baseURL && (await page.goto(baseURL));
    await use(page);
  },
});

const cases = parse(
  fs.readFileSync(
    path.join(process.cwd(), "csv", "ABPI_test.csv")
  ),
  {
    columns: true,
    skip_empty_lines: true,
  }
);

for (const testCase of cases) {
  test(testCase.test_case, async ({
    page,
  }) => {
   await page.goto('https://www.abpi.org.uk/' + testCase.url);

   await expect(page).toHaveScreenshot({fullPage: true, maxDiffPixels: 200});
  });
}