import "@testing-library/jest-dom"
import { screen } from '@testing-library/react'
import Login from './../../src/components/Login'
import React from "react"
import { renderWithProviders } from "../test-utils"

describe("Login form", () => {
  renderWithProviders(<Login/>)
  const usernameField = screen.getByLabelText('Username')
  const passwordField = screen.getByLabelText('Password')
  const loginButton = screen.getByRole('button', { name: "Login" })


  test("renders with buttons and fields", async () => {
    expect(usernameField).toBeInTheDocument()
    expect(passwordField).toBeInTheDocument()
    expect(loginButton).toBeInTheDocument()
  })
})