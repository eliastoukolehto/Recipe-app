import { expect, test } from '@playwright/test'
import { createUser } from './test_helper'

test.describe('Recipe app user', () => {

  test.beforeEach(async ({ page, request }) => {
    await request.post('http://localhost:4000', {
      data: {
        query: `mutation{
          reset
        }
        `
      }
    })
    await page.goto('http://localhost:5173')
  })

  test('has frontpage with correct elements', async ({ page }) => {
    await expect(page.getByRole('link', { name: "Login" })).toBeVisible()
    await expect(page.getByRole('link', { name: "Sign In" })).toBeVisible()
    await expect(page.getByRole('link', { name: "Recipe-app" })).toBeVisible()
  })

  test('can create an account', async ({ page }) => {
    await page.getByRole('link', { name: "Sign In" }).click()
    await page.getByLabel("Username").fill("TestUser")
    await page.getByLabel("Password", {exact: true}).fill("ValidPassword1")
    await page.getByLabel("Confirm password", {exact: true}).fill("ValidPassword1")
    await page.getByRole('button', { name: "Sign In" }).click()
    await expect(page.getByText(/Sign In Successful/i)).toBeVisible()
  })

  test('can log in to existing account', async ({ page }) => {
    await createUser(page, "TestUser", "ValidPassword1")
    await page.getByRole('link', { name: "Login" }).click()
    await page.getByLabel("Username").fill("TestUser")
    await page.getByLabel("Password").fill("ValidPassword1")
    await page.getByRole('button', { name: "Login" }).click()
    await expect(page.getByText(/Login Successful/i)).toBeVisible()
  })
})