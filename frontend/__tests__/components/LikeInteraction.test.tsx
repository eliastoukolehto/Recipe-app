import { vi } from 'vitest'
import LikeInteraction from '../../src/components/LikeInteraction'
import { ADD_RECIPE_LIKE, REMOVE_RECIPE_LIKE } from '../../src/graphql/queries/recipeQueries'
import { setUser } from '../../src/reducers/userReducer'
import { setupStore } from '../../src/store'
import { renderWithProviders } from '../test-utils'
import { recipeTestOutputVariables } from '../testVariables'
import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

const testUserData = { username: 'TestUser', id: '2', role: 0 }

const variableMatcher = vi.fn().mockReturnValue(true)

const addRecipeLikeMock = {
  request: {
    query: ADD_RECIPE_LIKE,
  },
  variableMatcher,
  result: {
    data: { likeRecipe: { recipeId: 123, userId: 1 } },
  },
}

const removeRecipeLikeMock = {
  request: {
    query: REMOVE_RECIPE_LIKE,
  },
  variableMatcher,
  result: {
    data: { removeRecipeLike: true },
  },
}

describe('likeInteraction tests', () => {
  describe('when not liked', () => {
    beforeEach(() => {
      const store = setupStore()
      store.dispatch(setUser(testUserData))
      renderWithProviders(
        <LikeInteraction recipe={recipeTestOutputVariables} showlikes={true} />,
        { store },
        [addRecipeLikeMock, removeRecipeLikeMock],
      )
    })

    test('renders with the likeButton and totalLikes visible', async () => {
      expect(screen.getByLabelText('likeButton')).toBeInTheDocument()
      expect(screen.getByLabelText('likeAmount')).toBeInTheDocument()
      expect(screen.queryByLabelText('removeLikeButton')).toBeNull()
      expect(await screen.findByText(recipeTestOutputVariables.totalLikes)).toBeInTheDocument()
    })

    test('calls with correct values', async () => {
      const likeButton = screen.getByLabelText('likeButton')

      const user = userEvent.setup()

      await user.click(likeButton)

      expect(variableMatcher).toHaveBeenCalledWith({ id: 123 })
    })

    test('gives tooltip on like', async () => {
      // Tests are flaky due to tooltips being on a timer
      // However using fake timers causes issues with react-testing-library
      const likeButton = screen.getByLabelText('likeButton')
      expect(screen.queryByText('Recipe Liked!')).toBeNull()

      const user = userEvent.setup()
      await user.click(likeButton)

      expect(await screen.findByText('Recipe Liked!')).toBeInTheDocument()
    })

    test('updates element correctly', async () => {
      const likeButton = screen.getByLabelText('likeButton')
      const user = userEvent.setup()

      await user.click(likeButton)

      expect(screen.queryByLabelText('likeButton')).toBeNull()
      expect(screen.getByLabelText('removeLikeButton')).toBeInTheDocument()
      expect(await screen.findByText(recipeTestOutputVariables.totalLikes + 1)).toBeInTheDocument()
    })
  })

  describe('when liked', () => {
    beforeEach(() => {
      const store = setupStore()
      store.dispatch(setUser(testUserData))
      renderWithProviders(
        <LikeInteraction recipe={{ ...recipeTestOutputVariables, likedByCurrentUser: true }} showlikes={true} />,
        { store },
        [addRecipeLikeMock, removeRecipeLikeMock],
      )
    })
    test('renders with the removeLikeButton and totalLikes visible', async () => {
      expect(screen.getByLabelText('removeLikeButton')).toBeInTheDocument()
      expect(screen.getByLabelText('likeAmount')).toBeInTheDocument()
      expect(screen.queryByLabelText('likeButton')).toBeNull()
      expect(await screen.findByText(recipeTestOutputVariables.totalLikes)).toBeInTheDocument()
    })

    test('calls with correct values', async () => {
      const removeLikeButton = screen.getByLabelText('removeLikeButton')

      const user = userEvent.setup()

      await user.click(removeLikeButton)

      expect(variableMatcher).toHaveBeenCalledWith({ id: 123 })
    })

    test('updates element correctly', async () => {
      const removeLikeButton = screen.getByLabelText('removeLikeButton')
      const user = userEvent.setup()

      await user.click(removeLikeButton)

      expect(screen.queryByLabelText('removeLikeButton')).toBeNull()
      expect(screen.getByLabelText('likeButton')).toBeInTheDocument()
      expect(await screen.findByText(recipeTestOutputVariables.totalLikes - 1)).toBeInTheDocument()
    })
  })

  describe('when not logged in', () => {
    beforeEach(() => {
      renderWithProviders(
        <LikeInteraction recipe={recipeTestOutputVariables} showlikes={true} />,
        {},
        [addRecipeLikeMock, removeRecipeLikeMock],
      )
    })

    test('does not make a request ', async () => {
      const likeButton = screen.getByLabelText('likeButton')

      const user = userEvent.setup()

      await user.click(likeButton)

      expect(variableMatcher).not.toHaveBeenCalledWith({ id: 123 })
    })

    test('gives tooltip warning', async () => {
      const likeButton = screen.getByLabelText('likeButton')
      expect(screen.queryByText('Login to add Likes!')).toBeNull()

      const user = userEvent.setup()
      await user.click(likeButton)

      expect(await screen.findByText('Login to add Likes!')).toBeInTheDocument()
    })

    test('does not update elements', async () => {
      const likeButton = screen.getByLabelText('likeButton')
      const user = userEvent.setup()

      await user.click(likeButton)

      expect(screen.queryByLabelText('removeLikeButton')).toBeNull()
      expect(screen.getByLabelText('likeButton')).toBeInTheDocument()
      expect(await screen.findByText(recipeTestOutputVariables.totalLikes)).toBeInTheDocument()
    })
  })
})
