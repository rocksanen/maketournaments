import { useQuery, gql } from '@apollo/client'

const QUERY = gql`
  query Countries {
    allUsers {
      name
    }
  }
`

export default function About() {
  const { data, loading, error } = useQuery(QUERY)

  if (loading) {
    return <h2>Loading...</h2>
  }

  if (error) {
    console.error("about error", error)
    return <h2>error</h2>
  }

  return (
    <div>
      <h2>Countries</h2>
      <p>{JSON.stringify(data)}</p>
    </div>
  )
}
