import { test as setup } from '@playwright/test';
import { LOG_IN, URLS } from '../test-data/constants';
import user from '../.auth/user.json'
import fs from 'fs'

const authFile = '.auth/user.json'

// Logging in with API
setup('authentication', async ({ request }) => {
    const response = await request.post(URLS.LOGIN, {
        data: {
            user: { email: LOG_IN.EMAIL, password: LOG_IN.PASSWORD }
        }
    });
    const responseBody = await response.json()
    const accessToken = responseBody.user.token
    user.origins[0].localStorage[0].value = accessToken
    fs.writeFileSync(authFile, JSON.stringify(user))
})