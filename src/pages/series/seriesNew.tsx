import { gql, useMutation, useQuery } from '@apollo/client'
import React, { useState } from 'react'
import { useSession } from 'next-auth/react'
import { Series } from '@/types/Series'
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Link,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
} from '@nextui-org/react'

// gets all the series based on the adminId. So gets the current users series
const FETCH_SERIES = gql`
  query GetAllSeries($adminId: ID) {
    allSeriesByAdmin(adminId: $adminId) {
      id
      name
    }
  }
`

const GET_TOURNAMENT_QUERY = gql`
  query GetTournamentByName($name: String!) {
    tournamentByName(name: $name) {
      id
      name
    }
  }
`

const CREATE_SERIES = gql`
  mutation CreateSeries($input: SeriesInput!) {
    createSeries(input: $input) {
      id
      name
    }
  }
`

const UPDATE_SERIES = gql`
  mutation UpdateSeries($input: UpdateSeriesInput!) {
    updateSeries(input: $input) {
      id
      name
      tournaments {
        id
        name
      }
    }
  }
`

function SeriesNew() {
  const { data: session } = useSession()

  const [seriesName, setSeriesName] = useState('')
  const [inviteModalOpen, setInviteModalOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  // gets the selected series from the table
  const [selectedSeries, setSelectedSeries] = useState<Series | null>(null)

  // get series data
  const { data, loading, error } = useQuery(FETCH_SERIES, {
    variables: { adminId: session?.user?.id },
  })

  // get tournament data
  const {
    data: tournamentData,
    error: tournamentError,
    refetch,
  } = useQuery(GET_TOURNAMENT_QUERY, {
    variables: { name: searchTerm },
  })

  // create series mutation, refetch used to update the table after new series is created
  const [createSeries] = useMutation(CREATE_SERIES, {
    refetchQueries: [{ query: FETCH_SERIES, variables: { adminId: session?.user?.id } }],
  })

  const [updateSeriesMutation] = useMutation(UPDATE_SERIES)

  const handleCreate = async () => {
    try {
      await createSeries({
        variables: {
          input: {
            name: seriesName,
            tournaments: [],
            admin: session?.user?.id,
            seriesCreated: new Date().toISOString(),
          },
        },
      })
      setSeriesName('')
    } catch (err) {
      console.error('Failed to create series', err)
    }
  }
  /*
  TODO: ApolloError: ID cannot represent value: { type: "Buffer", data: [Array] }
  id is the problem?
   */
  const handleAddTournamentToSeries = async (tournamentId: string) => {
    try {
      await updateSeriesMutation({
        variables: {
          input: {
            id: selectedSeries?.id,
            tournaments: [tournamentId],
          },
        },
      })
    } catch (err) {
      console.log('Failed to add tournament to series', err)
    }
  }

  const handleInviteClick = (series: Series) => {
    setSelectedSeries(series)
    setInviteModalOpen(true)
  }

  const handleInviteClose = () => setInviteModalOpen(false)

  // Handles the input change for searching for tournaments. fetches everytime input changes
  const handleInputChange = (e: any) => {
    setSearchTerm(e.target.value)
    refetch({ name: e.target.value })
  }

  if (tournamentError) return <div>Error fetching user! {tournamentError.message}</div>
  if (loading) return <div>Loading...</div>
  if (error) return <div>Error! {error.message}</div>

  return (
    <div>
      {session ? (
        <div>
          <h2>Series</h2>
          <Table aria-label="Series table">
            <TableHeader>
              <TableColumn>NAME</TableColumn>
              <TableColumn>ACTIONS</TableColumn>
            </TableHeader>
            <TableBody emptyContent="No rows to display.">
              {data.allSeriesByAdmin.map((series: Series) => (
                <TableRow key={series.id}>
                  <TableCell>{series.name}</TableCell>
                  <TableCell>
                    <button onClick={() => handleInviteClick(series)}>Add tournament</button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <div>
            <input
              value={seriesName}
              onChange={(e) => setSeriesName(e.target.value)}
              placeholder="Series Name"
            />
            <button onClick={handleCreate}>+</button>
          </div>

          <Modal isOpen={inviteModalOpen} onClose={handleInviteClose}>
            <ModalContent>
              <ModalHeader>Add Tournaments To Series</ModalHeader>
              <ModalBody>
                <input
                  type="text"
                  value={searchTerm}
                  onChange={handleInputChange}
                  placeholder="Search for tournament"
                />
                <div>
                  {tournamentData && tournamentData.tournamentByName && (
                    <div>
                      {tournamentData.tournamentByName.name}
                      <button
                        onClick={() =>
                          handleAddTournamentToSeries(tournamentData.tournamentByName.id)
                        }
                      >
                        Add to Series
                      </button>
                    </div>
                  )}
                </div>
              </ModalBody>
            </ModalContent>
          </Modal>
        </div>
      ) : (
        <div>
          <h2>Not signed in</h2>
          <Link href="/login">Sign in</Link>
        </div>
      )}
    </div>
  )
}

export default SeriesNew
