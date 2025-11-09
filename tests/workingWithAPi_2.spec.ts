import { test, expect } from '@playwright/test';
import { ARTICLES, BUTTONS, URLS } from '../test-data/constants';
import { getAuthToken } from '../utils/helpers';

test.beforeEach(async ({ page }) => {
    await page.goto(URLS.START_PAGE);
})

test('2. Create an article with API requests and delete', async ({ request, page }) => {
    // arrange
    const accessToken = await getAuthToken(request);
    const articleResponse = await request.post(URLS.ARTICLES, {
        data: { "article": ARTICLES.ARTICLE_1 },
        headers: {
            Authorization: `Token ${accessToken}`
        }
    })
    expect(articleResponse.status()).toEqual(201)
    await page.getByText(BUTTONS.GLOBAL_FEED).click()
    await page.getByText(ARTICLES.ARTICLE_1.title).click()

    // act
    await page.getByRole('button', { name: BUTTONS.DELETE }).first().click()

    // assert
    await page.getByText(BUTTONS.GLOBAL_FEED).click()
    await expect(page.locator('.preview-link h1').first()).not.toContainText(ARTICLES.ARTICLE_1.title)
});
