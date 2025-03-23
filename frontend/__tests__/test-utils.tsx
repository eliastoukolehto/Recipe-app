import { JSX, PropsWithChildren } from 'react'
import { AppStore, RootState, setupStore } from '../src/store'
import { MockedProvider, MockedResponse } from '@apollo/client/testing'
import { BrowserRouter } from 'react-router-dom'
import { Provider } from 'react-redux'
import React from 'react'
import { render, RenderOptions } from '@testing-library/react'

interface ExtendedRenderOptions extends Omit<RenderOptions, 'queries'> {
  preloadedState?: Partial<RootState>
  store?: AppStore
}

export const renderWithProviders = (
  ui: React.ReactElement,
  extendedRenderOptions: ExtendedRenderOptions = {},
  mocks?: MockedResponse[]
) => {
  const {
    preloadedState = {},
    store = setupStore(preloadedState),
    ...renderOptions
  } = extendedRenderOptions

  const Wrapper = ( { children }: PropsWithChildren): JSX.Element => {
    return (
    <MockedProvider mocks={mocks}>
      <BrowserRouter>
        <Provider store={store}>{children}</Provider>
     </BrowserRouter>
    </MockedProvider>
    )
  }
  return { store, ...render(ui, {wrapper: Wrapper, ...renderOptions})}
}