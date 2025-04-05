import { Page } from '@playwright/test'

const createUser = async (page: Page, username: string, password: string) => {
  await page.getByRole('link', { name: 'Sign In' }).click()
  await page.getByLabel('Username').fill(username)
  await page.getByLabel('Password', { exact: true }).fill(password)
  await page.getByLabel('Confirm password', { exact: true }).fill(password)
  await page.getByRole('button', { name: 'Sign In' }).click()
  await page.getByRole('link', { name: /recipe-app/i }).click()
}

const backendURL = 'http://localhost:4000'
const frontendURL = 'http://localhost:5173'

export { createUser, backendURL, frontendURL }
