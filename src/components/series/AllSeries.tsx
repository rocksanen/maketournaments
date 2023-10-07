import { useMutation, useQuery } from '@apollo/client'
import React, { useMemo, useState, useCallback } from 'react'
import { useSession } from 'next-auth/react'
import { Series } from '@/types/Series'
import {
  DELETE_SERIES,
  ADD_TO_TOURNAMENT,
  DELETE_TOURNAMENT_FROM_SERIES,
  FETCH_SERIES,
  GET_TOURNAMENTS_BY_SERIES,
} from '@/graphql/clientQueries/seriesOperations'
import { GET_TOURNAMENTS_BY_USER } from '@/graphql/clientQueries/tournamentOperations'
import { Button, Input, Link, Pagination } from '@nextui-org/react'
import { HouseIcon } from '@/components/icons/breadcrumb/house-icon'
import SeriesTable from '@/components/series/SeriesTable'
import SeriesModal from '@/components/series/SeriesModal'
import { SettingsIcon } from '@/components/icons/sidebar/settings-icon'
import { TrashIcon } from '@/components/icons/accounts/trash-icon'
import { InfoIcon } from '@/components/icons/accounts/info-icon'
import { DotsIcon } from '@/components/icons/accounts/dots-icon'
import { ExportIcon } from '@/components/icons/accounts/export-icon'

function AllSeries() {
  const { data: session } = useSession()

  const [inviteModalOpen, setInviteModalOpen] = useState(false)
  const [changeSeriesNameModalOpen, setChangeSeriesNameModalOpen] = useState(false)
  // gets the selected series from the table
  const [selectedSeries, setSelectedSeries] = useState<Series | null>(null)
  const [addTournamentToSeries] = useMutation(ADD_TO_TOURNAMENT)
  const [deleteTournamentFromSeries] = useMutation(DELETE_TOURNAMENT_FROM_SERIES)
  const [deleteSeries] = useMutation(DELETE_SERIES)
  // Table pagination settings
  const [filterValue, setFilterValue] = useState('')
  const [page, setPage] = useState(1)
  const rowsPerPage = 5

  const userId = session?.user?.id

  // get series data
  const { data: seriesByUser, error: fetchSeriesError } = useQuery(FETCH_SERIES, {
    variables: { adminId: userId },
  })

  const { data: tournamentsBySeriesData } = useQuery(GET_TOURNAMENTS_BY_SERIES, {
    variables: { seriesId: selectedSeries?.id },
  })

  const {
    loading,
    error: tournamentError,
    data: tournamentData,
    refetch,
  } = useQuery(GET_TOURNAMENTS_BY_USER, {
    variables: { userId },
    skip: !userId,
  })

  // Table pagination and filtering
  const filteredSeries = useMemo(() => {
    if (!filterValue) return seriesByUser?.allSeriesByAdmin || []

    return (seriesByUser?.allSeriesByAdmin || []).filter((series: Series) =>
      series.name.toLowerCase().includes(filterValue.toLowerCase()),
    )
  }, [filterValue, seriesByUser])

  const pages = Math.ceil(filteredSeries.length / rowsPerPage)

  const displayedSeries = useMemo(() => {
    const start = (page - 1) * rowsPerPage
    const end = start + rowsPerPage

    return filteredSeries.slice(start, end)
  }, [page, filteredSeries])

  const onSearchChange = useCallback((value: string) => {
    setFilterValue(value)
    setPage(1)
  }, [])

  const handleDeleteSeries = async (seriesId: string) => {
    console.log('seriesId', seriesId)
    try {
      const response = await deleteSeries({
        variables: {
          id: seriesId,
        },
        refetchQueries: [{ query: FETCH_SERIES, variables: { adminId: session?.user?.id } }],
      })

      const result = response.data.deleteSeries
      if (result === true) {
        alert('Series deleted successfully')
      } else {
        alert('Series not deleted, try again later')
      }
    } catch (error) {
      console.error('Error deleting series:', error)
      alert('Error. Please try again later.')
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

  const handleInviteClose = () => {
    setChangeSeriesNameModalOpen(false)
    setInviteModalOpen(false)
  }

  if (!seriesByUser) return <p>Loading...</p>
  if (tournamentError) return <div>Error fetching user! {tournamentError.message}</div>
  if (loading) return <div>Loading...</div>
  if (fetchSeriesError) return <div>Error! {fetchSeriesError.message}</div>

  return (
    <div className="my-14 max-w-[95rem] mx-auto w-full flex flex-col gap-4">
      <ul className="flex">
        <li className="flex gap-2">
          <HouseIcon />
          <Link href={'/'}>
            <span>Home</span>
          </Link>
          <span> / </span>{' '}
        </li>
      </ul>

      <h3 className="text-xl font-semibold">All series</h3>
      <div className="flex justify-between flex-wrap gap-4 items-center">
        <div className="flex items-center gap-3 flex-wrap md:flex-nowrap">
          <Input
            classNames={{
              input: 'w-full',
              mainWrapper: 'w-full',
            }}
            placeholder="Search series"
            value={filterValue}
            onValueChange={onSearchChange}
          />
          <SettingsIcon />
          <TrashIcon />
          <InfoIcon />
          <DotsIcon />
        </div>
        <div className="flex flex-row gap-3.5 flex-wrap">
          <Button color="primary" startContent={<ExportIcon />}>
            Export to CSV
          </Button>
        </div>
      </div>

      {/* Table of all series */}
      <SeriesTable
        seriesByUser={displayedSeries}
        handleInviteClick={handleInviteClick}
        handleDeleteSeries={handleDeleteSeries}
      />

      {/* Modal for inviting users to tournament and editing series name */}
      <SeriesModal
        inviteModalOpen={inviteModalOpen}
        onClose={handleInviteClose}
        handleInviteClose={handleInviteClose}
        changeSeriesNameModalOpen={changeSeriesNameModalOpen}
        setChangeSeriesNameModalOpen={setChangeSeriesNameModalOpen}
        selectedSeries={selectedSeries}
        handleAddTournamentToSeries={handleAddTournamentToSeries}
        handleDeleteTournamentFromSeries={handleDeleteTournamentFromSeries}
        tournamentData={tournamentData}
        tournamentsBySeriesData={tournamentsBySeriesData}
      />

      <Pagination showControls page={page} total={pages} onChange={setPage} />
    </div>
  )
}

export default AllSeries
