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
import { HouseIcon } from '@/components/icons/breadcrumb/house-icon'

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

const ADD_TO_TOURNAMENT = gql`
  mutation addTournamentToSeries($seriesId: ID!, $tournamentId: ID!) {
    addTournamentToSeries(seriesId: $seriesId, tournamentId: $tournamentId) {
      success
      message
    }
  }
`

function SeriesNew() {
  const { data: session } = useSession()

  const [tournamentName, setTournamentName] = useState('')
  const [inviteModalOpen, setInviteModalOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  // gets the selected series from the table
  const [selectedSeries, setSelectedSeries] = useState<Series | null>(null)
  const [addTournamentToSeries] = useMutation(ADD_TO_TOURNAMENT)

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

  const handleCreate = async () => {
    try {
      await createSeries({
        variables: {
          input: {
            name: tournamentName,
            tournaments: [],
            admin: session?.user?.id,
            seriesCreated: new Date().toISOString(),
          },
        },
      })
      setTournamentName('')
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
      })
      const { success, message } = response.data.addTournamentToSeries

      if (success) {
        alert('Tournament added to series successfully')
      } else {
        alert(`Error: ${message}`)
      }
    } catch (error) {
      console.error('Error adding tournament to series:', error)
      alert('Error. Please try again later.')
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
                onChange={(e) => setTournamentName(e.target.value)}
              />
              <Button color="primary" onClick={handleCreate}>
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
            <TableColumn>NAME</TableColumn>
            <TableColumn>ACTIONS</TableColumn>
          </TableHeader>
          <TableBody emptyContent="No rows to display.">
            {data.allSeriesByAdmin.map((series: Series) => (
              <TableRow key={series.id}>
                <TableCell>{series.name}</TableCell>
                <TableCell>
                  <button onClick={() => handleInviteClick(series)}>Add tournaments</button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <Modal isOpen={inviteModalOpen} onClose={handleInviteClose}>
        <ModalContent>
          <ModalHeader>Add Tournaments To Series</ModalHeader>
          <ModalBody>
            <Input
              type="text"
              value={searchTerm}
              onChange={handleInputChange}
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
          </ModalBody>
        </ModalContent>
      </Modal>
    </div>
  )
}

export default SeriesNew
