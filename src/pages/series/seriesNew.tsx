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
  Button,
  Input,
} from '@nextui-org/react'
import { EditIcon } from '@/components/icons/table/edit-icon'
import { DeleteIcon } from '@/components/icons/table/delete-icon'
import { HouseIcon } from '@/components/icons/breadcrumb/house-icon'
import { Tournament } from '@/types/Tournament'

// gets all the series based on the adminId. So gets the current users series
const FETCH_SERIES = gql`
  query GetAllSeries($adminId: ID) {
    allSeriesByAdmin(adminId: $adminId) {
      id
      name
      tournaments {
        id
        name
      }
    }
  }
`

const GET_TOURNAMENTS_BY_SERIES = gql`
  query GetTournamentsBySeries($seriesId: ID!) {
    tournamentsBySeries(seriesId: $seriesId) {
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

const ADD_TO_TOURNAMENT = gql`
  mutation addTournamentToSeries($seriesId: ID!, $tournamentId: ID!) {
    addTournamentToSeries(seriesId: $seriesId, tournamentId: $tournamentId) {
      success
      message
    }
  }
`

const DELETE_TOURNAMENT_FROM_SERIES = gql`
  mutation deleteTournamentFromSeries($seriesId: ID!, $tournamentId: ID!) {
    deleteTournamentFromSeries(seriesId: $seriesId, tournamentId: $tournamentId) {
      success
      message
    }
  }
`

function SeriesNew() {
  const { data: session } = useSession()

  const [seriesName, setSeriesName] = useState('')
  const [inviteModalOpen, setInviteModalOpen] = useState(false)
  const [searchTournament, setSearchTournament] = useState('')
  // gets the selected series from the table
  const [selectedSeries, setSelectedSeries] = useState<Series | null>(null)
  const [addTournamentToSeries] = useMutation(ADD_TO_TOURNAMENT)
  const [deleteTournamentFromSeries] = useMutation(DELETE_TOURNAMENT_FROM_SERIES)

  // get series data
  const { data, loading, error } = useQuery(FETCH_SERIES, {
    variables: { adminId: session?.user?.id },
  })

  const { data: tournamentsBySeriesData } = useQuery(GET_TOURNAMENTS_BY_SERIES, {
    variables: { seriesId: selectedSeries?.id },
  })

  console.log('data', tournamentsBySeriesData)

  // get tournament data
  const {
    data: tournamentData,
    error: tournamentError,
    refetch,
  } = useQuery(GET_TOURNAMENT_QUERY, {
    variables: { name: searchTournament },
  })

  // create series mutation, refetch used to update the table after new series is created
  const [createSeries] = useMutation(CREATE_SERIES, {
    refetchQueries: [{ query: FETCH_SERIES, variables: { adminId: session?.user?.id } }],
  })

  const handleCreateSeries = async () => {
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

  const handleAddTournamentToSeries = async (tournamentId: string) => {
    try {
      const response = await addTournamentToSeries({
        variables: {
          seriesId: selectedSeries?.id,
          tournamentId: tournamentId,
        },
        // refetches all series and tournaments by series after adding tournament to series
        refetchQueries: [
          { query: FETCH_SERIES, variables: { adminId: session?.user?.id } },
          { query: GET_TOURNAMENTS_BY_SERIES, variables: { seriesId: selectedSeries?.id } },
        ],
      })
      const { success, message } = response.data.addTournamentToSeries

      if (success) {
        setSeriesName('')
        alert('Tournament added to series successfully')
        await refetch()
      } else {
        alert(`Error: ${message}`)
      }
    } catch (error) {
      console.error('Error adding tournament to series:', error)
      alert('Error. Please try again later.')
    }
  }

  const handleDeleteTournamentFromSeries = async (tournamentId: string) => {
    try {
      const response = await deleteTournamentFromSeries({
        variables: {
          seriesId: selectedSeries?.id,
          tournamentId: tournamentId,
        },
        refetchQueries: [
          // refetches all series and tournaments by series after deleting tournament from series
          { query: FETCH_SERIES, variables: { adminId: session?.user?.id } },
          { query: GET_TOURNAMENTS_BY_SERIES, variables: { seriesId: selectedSeries?.id } },
        ],
      })
      const { success, message } = response.data.deleteTournamentFromSeries

      if (success) {
        setSearchTournament('')
        alert('Tournament deleted from series successfully')
        await refetch()
      } else {
        alert(`Error: ${message}`)
      }
    } catch (error) {
      console.error('Error deleting tournament from series:', error)
      alert('Error. Please try again later.')
    }
  }

  const handleInviteClick = (series: Series) => {
    setSelectedSeries(series)
    setInviteModalOpen(true)
  }

  const handleInviteClose = () => setInviteModalOpen(false)

  // Handles the input change for searching for tournaments. fetches everytime input changes
  const handleSearchTournamentInput = (e: any) => {
    setSearchTournament(e.target.value)
  }

  if (tournamentError) return <div>Error fetching user! {tournamentError.message}</div>
  if (loading) return <div>Loading...</div>
  if (error) return <div>Error! {error.message}</div>

  return (
    <div className="my-14 max-w-[95rem] mx-auto w-full flex flex-col gap-4">
      <ul className="flex">
        <li className="flex gap-2">
          <HouseIcon />
          <Link href={'/'}>
            <span>Home</span>
          </Link>
          <span> / </span>
        </li>
      </ul>

      <h3 className="text-xl font-semibold">Add New Series</h3>
      <div className="flex justify-between flex-wrap gap-4 items-center">
        <div className="flex items-center gap-3 flex-wrap md:flex-nowrap">
          {session ? (
            <>
              <Input
                type="text"
                placeholder="Series Name"
                value={seriesName}
                onChange={(e) => setSeriesName(e.target.value)}
              />
              <Button color="primary" onClick={handleCreateSeries}>
                Create Series
              </Button>
            </>
          ) : (
            <div>
              <h2>Not signed in</h2>
              <Link href="/login">Sign in</Link>
            </div>
          )}
        </div>
      </div>

      <div className="max-w-[95rem] w-1/2">
        <Table aria-label="Series table">
          <TableHeader>
            <TableColumn>Name</TableColumn>
            <TableColumn>No. Tournaments</TableColumn>
            <TableColumn>Actions</TableColumn>
          </TableHeader>
          <TableBody emptyContent="No rows to display.">
            {data.allSeriesByAdmin.map((series: Series) => (
              <TableRow key={series.id}>
                <TableCell>{series.name}</TableCell>
                <TableCell>{series.tournaments ? series.tournaments.length : 0}</TableCell>
                <TableCell>
                  <button onClick={() => handleInviteClick(series)}>
                    <EditIcon size={20} fill="#979797" />
                  </button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <Modal isOpen={inviteModalOpen} onClose={handleInviteClose}>
        <ModalContent>
          <ModalHeader>Add Tournaments To {selectedSeries?.name}</ModalHeader>
          <ModalBody>
            <Input
              type="text"
              value={searchTournament}
              onChange={handleSearchTournamentInput}
              placeholder="Search for tournament"
            />
            {tournamentData && tournamentData.tournamentByName && (
              <div>
                <p className="text-tiny text-white/60">Tournament name</p>
                <div className="flex justify-between items-center">
                  <span>{tournamentData.tournamentByName.name}</span>
                  <Button
                    color="primary"
                    size="sm"
                    onClick={() => handleAddTournamentToSeries(tournamentData.tournamentByName.id)}
                  >
                    Add to Series
                  </Button>
                </div>
              </div>
            )}
            <ModalHeader>Tournaments In {selectedSeries?.name}</ModalHeader>
            {tournamentsBySeriesData && tournamentsBySeriesData.tournamentsBySeries && (
              <Table aria-label="Tournaments in series table">
                <TableHeader>
                  <TableColumn>Name</TableColumn>
                  <TableColumn>Actions</TableColumn>
                </TableHeader>
                <TableBody emptyContent="No rows to display.">
                  {tournamentsBySeriesData.tournamentsBySeries.map((tournament: Tournament) => (
                    <TableRow key={tournament.id}>
                      <TableCell>{tournament.name}</TableCell>
                      <TableCell>
                        <button onClick={() => handleDeleteTournamentFromSeries(tournament?.id)}>
                          <DeleteIcon size={20} fill="#979797" />
                        </button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </ModalBody>
        </ModalContent>
      </Modal>
    </div>
  )
}

export default SeriesNew
