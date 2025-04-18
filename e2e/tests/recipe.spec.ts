import { expect, test } from '@playwright/test'
import { backendURL, createRecipe, createUserAndLogin, frontendURL } from './test_helper'

test.describe('Recipe app recipe', () => {
  test.beforeEach(async ({ page, request }) => {
    await request.post(backendURL, {
      data: {
        query: `mutation{
          reset
        }
        `,
      },
    })
    await page.goto(frontendURL)
  })

  test('can be created after logging in', async ({ page }) => {
    await createUserAndLogin(page, 'TestUser', 'ValidPassword1')
    await page.getByRole('link', { name: 'New Recipe' }).click()
    await page.getByLabel('Name', { exact: true }).nth(0).fill('Testrecipe Name')
    await page.getByLabel('Description').fill('Testrecipe Description')
    await page.getByLabel('Step').fill('Testrecipe Step')
    await page.getByLabel('Name', { exact: true }).nth(1).fill('TestIngredient')
    await page.getByLabel('Unit').nth(1).fill('dl')
    await page.getByRole('button', { name: 'Create' }).click()
    await expect(page.getByText(/Adding recipe succeeded/i)).toBeVisible()
  })

  test('appears on frontpage after creation', async ({ page }) => {
    await createUserAndLogin(page, 'TestUser', 'ValidPassword1')
    await createRecipe(page, 'TestRecipe', 'TestDescription')
    await expect(page.getByText(/TestRecipe/i)).toBeVisible()
    await expect(page.getByText(/TestDescription/i)).toBeVisible()
    await expect(page.getByText(/view/i)).toBeVisible()
  })

  test('page can be accessed from frontpage', async ({ page }) => {
    await createUserAndLogin(page, 'TestUser', 'ValidPassword1')
    await createRecipe(page, 'TestRecipe', 'TestDescription')
    await expect(page.getByText(/view/i)).toBeVisible()
    await page.getByRole('link', { name: /view/i }).click()
    await expect(page.getByText(/TestRecipe/i).nth(0)).toBeVisible()
    await expect(page.getByText(/TestDescription/i)).toBeVisible()
  })
})
