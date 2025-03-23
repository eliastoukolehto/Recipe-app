import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import { Provider } from 'react-redux'
import { BrowserRouter } from 'react-router-dom'
import { setupStore } from './store.ts'
import { ApolloProvider } from '@apollo/client'
import { apolloClient } from './graphql/apolloClient.ts'
import { theme } from './theme.ts'
import { ThemeProvider } from '@mui/material'


const store = setupStore()

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <ApolloProvider client={apolloClient}>
        <Provider store={store}>
          <ThemeProvider theme={theme}>
            <App />
          </ThemeProvider>
        </Provider>
      </ApolloProvider>
    </BrowserRouter>
  </StrictMode>
)
