import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import { Provider } from 'react-redux'
import { BrowserRouter } from 'react-router-dom'
import { store } from './store.ts'
import { ApolloProvider } from '@apollo/client'
import { apolloClient } from './graphql/apolloClient.ts'


createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <ApolloProvider client={apolloClient}>
        <Provider store={store}>
          <App />
        </Provider>
      </ApolloProvider>
    </BrowserRouter>
  </StrictMode>
)
