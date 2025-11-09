import { test, expect, Locator, Page } from '@playwright/test';
import { tags } from '../test-data/tags.json';
import { ARTICLES, URLS } from '../test-data/constants';

test.beforeEach(async ({ page }) => {
  // Mock API tags response
  await page.route('*/**/api/tags', async (route) => {
    await route.fulfill({
      body: JSON.stringify({ tags }),
    });
  });

  // Modify API articles response
  await page.route('*/**/api/articles?limit=10&offset=0', async (route) => {
    const response = await route.fetch();
    const responseBody = await response.json();

    responseBody.articles[0].title = ARTICLES.ARTICLE_2.title;
    responseBody.articles[0].description = ARTICLES.ARTICLE_2.description;

    await route.fulfill({
      body: JSON.stringify(responseBody),
    });
  });

  await page.goto(URLS.START_PAGE);
});

function getTagLocators(page: Page): Locator[] {
  return tags.map((tag) => page.locator('a.tag-default', { hasText: tag }));
}

test('1. Mock and modify API to display the article', async ({ page }) => {
  const articleTitle = page.locator('.preview-link h1').first();
  const articleDescription = page.locator('.preview-link p').first();
  const tagLocators = getTagLocators(page);

  await expect(articleTitle).toHaveText(ARTICLES.ARTICLE_2.title);
  await expect(articleDescription).toHaveText(ARTICLES.ARTICLE_2.description);
  for (const tagLocator of tagLocators) {
    await expect(tagLocator).toBeVisible();
  }
});
