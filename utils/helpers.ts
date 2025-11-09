import { Page, APIRequestContext } from '@playwright/test';
import { BUTTONS, PLACEHOLDES, URLS, LOG_IN } from '../test-data/constants';

/**
 * Create an article through the UI
 * @param page - Playwright Page object
 * @param article - Article object with title, description, body
 */
export async function createArticleViaUI(page: Page, article: any) {
    await page.getByText(BUTTONS.NEW_ARTICLE).click();
    await page.getByPlaceholder(PLACEHOLDES.TITLE).fill(article.title);
    await page.getByPlaceholder(PLACEHOLDES.DESCRIPTION).fill(article.description);
    await page.getByPlaceholder(PLACEHOLDES.BODY).fill(article.body);
    await page.getByRole('button', { name: BUTTONS.PUBLISH_ARTICLE }).click();
}

/**
 * Get authentication token for API requests
 * @param request - Playwright APIRequestContext
 * @returns Authentication token string
 */
export async function getAuthToken(request: APIRequestContext): Promise<string> {
    const response = await request.post(URLS.LOGIN, {
        data: {
            user: { 
                email: LOG_IN.EMAIL, 
                password: LOG_IN.PASSWORD 
            }
        }
    });
    const responseBody = await response.json();
    return responseBody.user.token;
}