import { test, expect } from '@playwright/test';
import { ARTICLES, BUTTONS, URLS } from '../test-data/constants';
import { createArticleViaUI, getAuthToken } from '../utils/helpers';

test.beforeEach(async ({ page }) => {
    await page.goto(URLS.START_PAGE);
})

test('3. Create an article by UI and delete with API requests', async ({ request, page }) => {
    // arrange
    await createArticleViaUI(page, ARTICLES.ARTICLE_2);
    const articleResponse = await page.waitForResponse(URLS.ARTICLES)
    const articleResponseBody = await articleResponse.json();
    const slugId = articleResponseBody.article.slug
    await expect(page.locator('.article-page h1')).toContainText(ARTICLES.ARTICLE_2.title)

    await page.locator('.nav-link', { hasText: BUTTONS.HOME }).click()
    await page.getByText(BUTTONS.GLOBAL_FEED).click()

    const accessToken = await getAuthToken(request);

    // act
    const deleteArticleResponse = await request.delete(`${URLS.ARTICLES}${slugId}`, {
        headers: {
            Authorization: `Token ${accessToken}`
        }
    })

    // assert
    expect(deleteArticleResponse.status()).toEqual(204)
    await page.getByText(BUTTONS.GLOBAL_FEED).click()
    await expect(page.locator('.preview-link h1').first()).not.toContainText(ARTICLES.ARTICLE_2.title)
});
