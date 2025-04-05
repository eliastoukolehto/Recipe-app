import '@testing-library/jest-dom/vitest'
import '@testing-library/jest-dom'
import { screen } from '@testing-library/react'
import { renderWithProviders } from '../test-utils'
import SignIn from '../../src/components/SignIn'
import userEvent from '@testing-library/user-event'
import { SIGN_IN } from '../../src/graphql/queries/userQueries'
import { vi } from 'vitest'

const variableMatcher = vi.fn().mockReturnValue(true)

const signInQueryMock = {
  request: {
    query: SIGN_IN,
  },
  variableMatcher,
  result: {
    data: { createUser: { username: 'ValidUsername', id: 1 } },
  },

}

describe('Sign In form', () => {
  beforeEach(() => {
    renderWithProviders(<SignIn />, {}, [signInQueryMock])
  })

  test('renders with buttons and fields', () => {
    expect(screen.getByLabelText('Username')).toBeInTheDocument()
    expect(screen.getByLabelText('Password')).toBeInTheDocument()
    expect(screen.getByLabelText('Confirm password')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Sign In' })).toBeInTheDocument()
  })

  test('values update correctly', async () => {
    const usernameField = screen.getByLabelText('Username')
    const passwordField = screen.getByLabelText('Password')
    const confirmationField = screen.getByLabelText('Confirm password')
    const user = userEvent.setup()

    expect(usernameField).toHaveValue('')
    expect(passwordField).toHaveValue('')
    expect(confirmationField).toHaveValue('')

    await user.type(usernameField, 'testUsername')
    await user.type(passwordField, 'testPassword')
    await user.type(confirmationField, 'confirmation')
    expect(usernameField).toHaveValue('testUsername')
    expect(passwordField).toHaveValue('testPassword')
    expect(confirmationField).toHaveValue('confirmation')
  })

  test('warns about empty fields', async () => {
    const usernameField = screen.getByLabelText('Username')
    const passwordField = screen.getByLabelText('Password')
    const confirmationField = screen.getByLabelText('Confirm password')
    const signInButton = screen.getByRole('button', { name: 'Sign In' })
    const user = userEvent.setup()

    await user.click(signInButton)

    expect(usernameField).toHaveAccessibleDescription('Required')
    expect(passwordField).toHaveAccessibleDescription('Required')
    expect(confirmationField).toHaveAccessibleDescription('Required')
  })

  test('warns about short username', async () => {
    const usernameField = screen.getByLabelText('Username')
    const signInButton = screen.getByRole('button', { name: 'Sign In' })
    const user = userEvent.setup()

    await user.type(usernameField, 'me')

    await user.click(signInButton)

    expect(usernameField).toHaveAccessibleDescription('Username must be at least 3 characters')
  })

  test('warns about invalid username characters', async () => {
    const usernameField = screen.getByLabelText('Username')
    const signInButton = screen.getByRole('button', { name: 'Sign In' })
    const user = userEvent.setup()

    await user.type(usernameField, 'test user')

    await user.click(signInButton)

    expect(usernameField).toHaveAccessibleDescription('Username has forbidden characters')
  })

  test('warns about too long username', async () => {
    const usernameField = screen.getByLabelText('Username')
    const signInButton = screen.getByRole('button', { name: 'Sign In' })
    const user = userEvent.setup()

    await user.type(usernameField, 'TooLongUsername')

    await user.click(signInButton)

    expect(usernameField).toHaveAccessibleDescription('Username is too long')
  })

  test('warns about too short password', async () => {
    const passwordField = screen.getByLabelText('Password')
    const signInButton = screen.getByRole('button', { name: 'Sign In' })
    const user = userEvent.setup()

    await user.type(passwordField, 'Short1')

    await user.click(signInButton)

    expect(passwordField).toHaveAccessibleDescription('Password must be at least 8 characters')
  })

  test('warns about too long password', async () => {
    const passwordField = screen.getByLabelText('Password')
    const signInButton = screen.getByRole('button', { name: 'Sign In' })
    const user = userEvent.setup()

    await user.type(passwordField, 'ThisPasswordIsOver30CharactersLong')

    await user.click(signInButton)

    expect(passwordField).toHaveAccessibleDescription('Password is too long')
  })

  test('warns about password without lowercase letters', async () => {
    const passwordField = screen.getByLabelText('Password')
    const signInButton = screen.getByRole('button', { name: 'Sign In' })
    const user = userEvent.setup()

    await user.type(passwordField, 'BADPASSWORD1')

    await user.click(signInButton)

    expect(passwordField).toHaveAccessibleDescription('Password must contain at least one lowercase letter')
  })

  test('warns about password without uppercase letters', async () => {
    const passwordField = screen.getByLabelText('Password')
    const signInButton = screen.getByRole('button', { name: 'Sign In' })
    const user = userEvent.setup()

    await user.type(passwordField, 'badpassword1')

    await user.click(signInButton)

    expect(passwordField).toHaveAccessibleDescription('Password must contain at least one uppercase letter')
  })

  test('warns about password without numbers', async () => {
    const passwordField = screen.getByLabelText('Password')
    const signInButton = screen.getByRole('button', { name: 'Sign In' })
    const user = userEvent.setup()

    await user.type(passwordField, 'BadPassword')

    await user.click(signInButton)

    expect(passwordField).toHaveAccessibleDescription('Password must contain at least one number')
  })

  test('warns about password confirmation not matching', async () => {
    const passwordField = screen.getByLabelText('Password')
    const confirmationField = screen.getByLabelText('Confirm password')
    const signInButton = screen.getByRole('button', { name: 'Sign In' })
    const user = userEvent.setup()

    await user.type(passwordField, 'ValidPassword1')
    await user.type(confirmationField, 'confirm')

    await user.click(signInButton)

    expect(confirmationField).toHaveAccessibleDescription('Passwords must match')
  })

  test('calls api with correct values', async () => {
    const usernameField = screen.getByLabelText('Username')
    const passwordField = screen.getByLabelText('Password')
    const confirmationField = screen.getByLabelText('Confirm password')
    const signInButton = screen.getByRole('button', { name: 'Sign In' })
    const user = userEvent.setup()

    await user.type(usernameField, 'ValidUsername')
    await user.type(passwordField, 'ValidPassword1')
    await user.type(confirmationField, 'ValidPassword1')
    await user.click(signInButton)

    expect(variableMatcher).toHaveBeenCalledWith({ username: 'ValidUsername', password: 'ValidPassword1' })
  })
})
