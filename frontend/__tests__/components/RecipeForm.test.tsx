import RecipeForm from '../../src/components/RecipeForm/RecipeForm'
import { ADD_RECIPE } from '../../src/graphql/queries/recipeQueries'
import { setUser } from '../../src/reducers/userReducer'
import { setupStore } from '../../src/store'
import { renderWithProviders } from '../test-utils'
import { vi } from 'vitest'
import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

const testUserData = { username: 'TestUser', id: '1' }

const variableMatcher = vi.fn().mockReturnValue(true)

const addRecipeMock = {
  request: {
    query: ADD_RECIPE,
  },
  variableMatcher,
  result: {
    data: {},
  },
}

// increase tests after remaking the recipeform
describe('Recipe form', () => {
  beforeEach(() => {
    const store = setupStore()
    store.dispatch(setUser(testUserData))
    renderWithProviders(<RecipeForm />, { store }, [addRecipeMock])
  })

  test('renders with correct content', async () => {
    expect(screen.getAllByLabelText('Name')[0]).toBeInTheDocument()
    expect(screen.getByLabelText('Description')).toBeInTheDocument()

    expect(screen.getByLabelText('Step')).toBeInTheDocument()

    expect(screen.getByLabelText('Category name')).toBeInTheDocument()
    expect(screen.getByLabelText('Amount')).toBeInTheDocument()
    expect(screen.getAllByLabelText('Unit')[0]).toBeInTheDocument()
    expect(screen.getAllByLabelText('Name')[1]).toBeInTheDocument()

    expect(screen.getByLabelText('Servings')).toBeInTheDocument()
    expect(screen.getByLabelText('Per person')).toBeInTheDocument()
    expect(screen.getAllByLabelText('Unit')[1]).toBeInTheDocument()

    expect(screen.getByLabelText('Prepare time')).toBeInTheDocument()

    expect(screen.getByRole('button', { name: 'Create' })).toBeInTheDocument()
  })

  test('calls api with correct values', async () => {
    const nameField = screen.getAllByLabelText('Name')[0]
    const descriptionField = screen.getByLabelText('Description')
    const stepField = screen.getByLabelText('Step')
    const categoryNameField = screen.getByLabelText('Category name')
    const ingredientAmountField = screen.getByLabelText('Amount')
    const ingredientNameField = screen.getAllByLabelText('Name')[1]
    const ingredientUnitField = screen.getAllByLabelText('Unit')[0]
    const servingsField = screen.getByLabelText('Servings')
    const servingPerField = screen.getByLabelText('Per person')
    const servingUnitField = screen.getAllByLabelText('Unit')[1]
    const prepareTimeField = screen.getByLabelText('Prepare time')

    const createButton = screen.getByRole('button', { name: 'Create' })
    const user = userEvent.setup()

    await user.type(nameField, 'testrecipe name')
    await user.type(descriptionField, 'testrecipe description')
    await user.type(stepField, 'testrecipe step')
    await user.type(categoryNameField, 'categoryname')
    await user.type(ingredientAmountField, '{backspace}100')
    await user.type(ingredientNameField, 'testingredient')
    await user.type(ingredientUnitField, '{backspace}g')
    await user.type(servingsField, '1')
    await user.type(servingPerField, '100')
    await user.type(servingUnitField, 'g')
    await user.type(prepareTimeField, '5')

    await user.click(createButton)

    expect(variableMatcher).toHaveBeenCalledWith(
      {
        description: 'testrecipe description',
        ingredientCategories: [
          {
            ingredients: [
              {
                amount: 100,
                name: 'testingredient',
                unit: 'g',
              },
            ],
            name: 'categoryname',
          },
        ],
        name: 'testrecipe name',
        prepareTime: 5,
        serving: {
          amount: 1,
          per: 100,
          unit: 'g',
        },
        steps: [
          'testrecipe step',
        ],
      },
    )
  })

  test('shows correct errors with empty fields', async () => {
    const nameField = screen.getAllByLabelText('Name')[0]
    const stepField = screen.getByLabelText('Step')

    const createButton = screen.getByRole('button', { name: 'Create' })
    const user = userEvent.setup()

    await user.click(createButton)

    const servingError = screen.getByTestId('servingError')
    const ingredientNameError = screen.getByTestId('ingredientNameError')

    expect(nameField).toHaveAccessibleDescription('Name required')
    expect(stepField).toHaveAccessibleDescription('Step can\'t be empty')
    expect(servingError.textContent).toEqual('Servings must be more than 1')
    expect(ingredientNameError.textContent).toEqual('Ingredients must have a name')
  })

  test('submits with servings removed', async () => {
    const nameField = screen.getAllByLabelText('Name')[0]
    const stepField = screen.getByLabelText('Step')
    const ingredientNameField = screen.getAllByLabelText('Name')[1]
    const removeServingButton = screen.getByRole('button', { name: 'Remove serving' })

    const createButton = screen.getByRole('button', { name: 'Create' })
    const user = userEvent.setup()

    await user.type(nameField, 'testrecipe name')
    await user.type(ingredientNameField, 'testingredient')
    await user.type(stepField, 'testrecipe step')
    await user.click(removeServingButton)

    await user.click(createButton)

    expect(variableMatcher).toHaveBeenCalledWith(
      {
        description: '',
        ingredientCategories: [
          {
            ingredients: [
              {
                amount: 1,
                name: 'testingredient',
                unit: 'g',
              },
            ],
            name: '',
          },
        ],
        name: 'testrecipe name',
        steps: [
          'testrecipe step',
        ],
      },
    )
  })

  test('has correct amount of fields', async () => {
    const nameFields = screen.getAllByLabelText('Name')
    expect(nameFields.length).toEqual(2)
    const stepFields = screen.getAllByLabelText('Step')
    expect(stepFields.length).toEqual(1)
    const categoryNameFields = screen.getAllByLabelText('Category name')
    expect(categoryNameFields.length).toEqual(1)
  })

  test('can have at most 20 ingredients', async () => {
    const nameFields = screen.getAllByLabelText('Name')
    expect(nameFields.length).toEqual(2)
    const addIngredientButton = screen.getByTestId('addIngredientButton')
    const user = userEvent.setup()

    for (let i = 0; i < 25; i++) {
      await user.click(addIngredientButton)
    }
    expect(addIngredientButton).not.toBeVisible()
    const newNameFields = screen.getAllByLabelText('Name')
    expect(newNameFields.length).toEqual(21)
  })

  test('can add more ingredients', async () => {
    const nameFields = screen.getAllByLabelText('Name')
    expect(nameFields.length).toEqual(2)
    const addIngredientButton = screen.getByTestId('addIngredientButton')
    const user = userEvent.setup()

    await user.click(addIngredientButton)

    const newNameFields = screen.getAllByLabelText('Name')
    expect(newNameFields.length).toEqual(3)
  })

  test('can have at most 10 categories', async () => {
    const categoryFields = screen.getAllByLabelText('Category name')
    expect(categoryFields.length).toEqual(1)
    const addCategoryButton = screen.getByRole('button', { name: 'New category' })
    const user = userEvent.setup()

    for (let i = 0; i < 15; i++) {
      await user.click(addCategoryButton)
    }

    expect(addCategoryButton).not.toBeVisible()
    const newCategoryFields = screen.getAllByLabelText('Category name')
    expect(newCategoryFields.length).toEqual(10)
  })

  test('can have at most 10 steps', async () => {
    const stepFields = screen.getAllByLabelText('Step')
    expect(stepFields.length).toEqual(1)
    const addStepButton = screen.getByTestId('addStepButton')
    const user = userEvent.setup()

    for (let i = 0; i < 15; i++) {
      await user.click(addStepButton)
    }

    expect(addStepButton).not.toBeVisible()
    const newStepFields = screen.getAllByLabelText('Step')
    expect(newStepFields.length).toEqual(10)
  })
})
