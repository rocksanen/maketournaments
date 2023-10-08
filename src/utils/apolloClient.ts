import { ApolloClient, HttpLink, InMemoryCache } from '@apollo/client'

const createApolloClient = () => {
  return new ApolloClient({
    cache: new InMemoryCache(),
    link: new HttpLink({
      uri: '/api/graphql/',
    }),
  })
}

export default createApolloClient
