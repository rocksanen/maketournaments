import { ApolloSandbox } from '@apollo/sandbox/react'

export default function EmbeddedSandbox() {
  return (
    <ApolloSandbox
      className="w-full h-screen"
      initialEndpoint="http://localhost:3000/api/graphql/"
    />
  )
}
