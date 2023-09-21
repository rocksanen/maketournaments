import { ApolloClient, InMemoryCache } from '@apollo/client'

const createApolloClient = () => {
  return new ApolloClient({
    uri: 'https://localhost:3000/api/graphql',
    cache: new InMemoryCache(),
  })
}

export default createApolloClient
