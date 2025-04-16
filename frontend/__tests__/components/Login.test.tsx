import { screen } from '@testing-library/react'
import Login from '../../src/components/Login'
import { renderWithProviders } from '../test-utils'
import userEvent from '@testing-library/user-event'
import { LOGIN, USER } from '../../src/graphql/queries/userQueries'
import { vi } from 'vitest'

const userQueryMock = {
  request: {
    query: USER,
  },
  result: {
    data: { me: { __typename: 'User', username: 'username', id: 1 } },
  },
  maxUsageCount: 2,
}

const variableMatcher = vi.fn().mockReturnValue(true)

const loginQueryMock = {
  request: {
    query: LOGIN,
  },
  variableMatcher,
  result: {
    data: { login: { value: 'userAuthString' } },
  },
}

describe('Login form', () => {
  beforeEach(() => {
    renderWithProviders(<Login />, {}, [userQueryMock, loginQueryMock])
  })

  test('renders with button and fields', async () => {
    expect(screen.getByLabelText('Username')).toBeInTheDocument()
    expect(screen.getByLabelText('Password')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Login' })).toBeInTheDocument()
  })

  test('values update correctly', async () => {
    const usernameField = screen.getByLabelText('Username')
    const passwordField = screen.getByLabelText('Password')
    const user = userEvent.setup()

    expect(usernameField).toHaveValue('')
    expect(passwordField).toHaveValue('')

    await user.type(usernameField, 'testUsername')
    await user.type(passwordField, 'testPassword')
    expect(usernameField).toHaveValue('testUsername')
    expect(passwordField).toHaveValue('testPassword')
  })

  test('shows errors if fields are empty', async () => {
    const loginButton = screen.getByRole('button', { name: 'Login' })
    const usernameField = screen.getByLabelText('Username')
    const passwordField = screen.getByLabelText('Password')
    const user = userEvent.setup()

    await user.click(loginButton)

    expect(usernameField).toHaveAccessibleDescription('Required')
    expect(passwordField).toHaveAccessibleDescription('Required')
  })

  test('calls api with correct values', async () => {
    const usernameField = screen.getByLabelText('Username')
    const passwordField = screen.getByLabelText('Password')
    const loginButton = screen.getByRole('button', { name: 'Login' })
    const user = userEvent.setup()

    await user.type(usernameField, 'testUsername')
    await user.type(passwordField, 'testPassword')
    await user.click(loginButton)

    expect(variableMatcher).toHaveBeenCalledWith({ username: 'testUsername', password: 'testPassword' })
  })
})
