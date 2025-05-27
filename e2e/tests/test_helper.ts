import { Page } from '@playwright/test'

const createUser = async (page: Page, username: string, password: string) => {
  await page.getByRole('link', { name: 'Sign In' }).click()
  await page.getByLabel('Username').fill(username)
  await page.getByLabel('Password', { exact: true }).fill(password)
  await page.getByLabel('Confirm password', { exact: true }).fill(password)
  await page.getByRole('button', { name: 'Sign In' }).click()
  await page.getByRole('link', { name: /recipe-app/i }).click()
}

const createUserAndLogin = async (page: Page, username: string, password: string) => {
  await createUser(page, username, password)
  await page.getByRole('link', { name: 'Login' }).click()
  await page.getByLabel('Username').fill(username)
  await page.getByLabel('Password').fill(password)
  await page.getByRole('button', { name: 'Login' }).click()
}

const createRecipe = async (page: Page, name: string, description: string) => {
  await page.getByRole('link', { name: 'New Recipe' }).click()
  await page.getByLabel('Name', { exact: true }).nth(0).fill(name)
  await page.getByLabel('Description').fill(description)
  await page.getByLabel('Step').fill('Testrecipe Step')
  await page.getByLabel('Name', { exact: true }).nth(1).fill('TestIngredient')
  await page.getByRole('button', { name: 'Remove serving' }).click()
  await page.getByRole('button', { name: 'Create' }).click()
  await page.waitForURL('**/recipes/**')
  await page.getByRole('link', { name: /recipe-app/i }).click()
}

const logout = async (page: Page) => {
  await page.getByLabel('userMenuButton').click()
  await page.getByText(/logout/i).click()
}

const backendURL = 'http://localhost:4000'
const frontendURL = 'http://localhost:5173'

export { createUser, createUserAndLogin, createRecipe, logout, backendURL, frontendURL }
