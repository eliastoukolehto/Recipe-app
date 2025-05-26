import { vi } from 'vitest'
import { DELETE_RECIPE, GET_RECIPE } from '../../src/graphql/queries/recipeQueries'
import { setupStore } from '../../src/store'
import { renderWithProviders } from '../test-utils'
import { setUser } from '../../src/reducers/userReducer'
import RecipePage from '../../src/components/RecipePage'
import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

const testUserData = { username: 'TestUser', id: '1' }

const testRecipeData = {
  recipe: {
    id: '123',
    name: 'testrecipe',
    description: '',
    ingredientCategories: [
      {
        name: '',
        ingredients: [
          {
            amount: 1,
            name: 'ingredient',
            unit: 'g',
          },
        ],
      },
    ],
    steps: ['step'],
    serving: null,
    prepareTime: null,
    user: {
      id: '1',
      username: 'TestUser',
    },
  },
}

const variableMatcher = vi.fn().mockReturnValue(true)

vi.mock('react-router-dom', async () => {
  const original = await vi.importActual('react-router-dom')
  return { ...original, useParams: () => ({ recipeId: '123' }) }
})

const deleteRecipeMock = {
  request: {
    query: DELETE_RECIPE,
  },
  variableMatcher,
}

const getRecipeMock = {
  request: {
    query: GET_RECIPE,
  },
  variableMatcher: () => true,
  result: {
    data: { recipe: testRecipeData.recipe },
  },
}

describe('Recipe page', () => {
  describe('With same user', () => {
    beforeEach(() => {
      const store = setupStore()
      store.dispatch(setUser(testUserData))
      renderWithProviders(<RecipePage />, { store }, [deleteRecipeMock, getRecipeMock])
    })
    test('Can be deleted', async () => {
      await screen.findByText('testrecipe')
      const user = userEvent.setup()

      await user.click(screen.getByLabelText('editButton'))
      await user.click(screen.getByText('Delete'))
      await user.click(screen.getByRole('button', { name: 'Yes' }))

      expect(variableMatcher).toHaveBeenCalledWith({ id: '123' })
    })
  })
  describe('With different user', () => {
    beforeEach(() => {
      const store = setupStore()
      store.dispatch(setUser({ username: 'TestUser2', id: '2' }))
      renderWithProviders(<RecipePage />, { store }, [deleteRecipeMock, getRecipeMock])
    })
    test('Cannot be deleted', async () => {
      await screen.findByText('testrecipe')

      expect(screen.queryByLabelText('editButton')).toBeNull()
    })
  })
})
