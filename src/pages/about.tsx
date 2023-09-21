import { useQuery, gql } from '@apollo/client'

const QUERY = gql`
  query {
    allUsers {
      name
      email
    }
  }
`

export default function About() {
  const { data, loading, error } = useQuery(QUERY)

  if (loading) {
    return <h2>Loading...</h2>
  }

  if (error) {
    console.error('about error', error)
    return <h2>error</h2>
  }

  return (
    <div>
      <h2>users</h2>
      <p>{JSON.stringify(data)}</p>
    </div>
  )
}
