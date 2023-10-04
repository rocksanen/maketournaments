import { ApolloSandbox } from '@apollo/sandbox/react'

export default function EmbeddedSandbox() {
  return <ApolloSandbox className="w-full h-screen" initialEndpoint="/api/graphql/" />
}
