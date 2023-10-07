import React, { useState, useMemo, useCallback } from 'react'
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Input,
  Button,
  Pagination,
} from '@nextui-org/react'
import { EditIcon } from '@/components/icons/table/edit-icon'
import { DeleteIcon } from '@/components/icons/table/delete-icon'
import UpdateSeriesNameModal from '@/components/series/UpdateSeriesNameModal'
import { Tournament } from '@/types/Tournament'

interface SeriesModalProps {
  inviteModalOpen: boolean
  onClose: () => void
  tournamentData: any
  // eslint-disable-next-line no-unused-vars
  handleAddTournamentToSeries: (id: string) => void
  selectedSeries: any
  handleInviteClose: () => void
  changeSeriesNameModalOpen: boolean
  // eslint-disable-next-line no-unused-vars
  setChangeSeriesNameModalOpen: (state: boolean) => void
  tournamentsBySeriesData: any
  // eslint-disable-next-line no-unused-vars
  handleDeleteTournamentFromSeries: (id: string) => void
}

export default function SeriesModal({
  inviteModalOpen,
  onClose,
  tournamentData,
  handleAddTournamentToSeries,
  selectedSeries,
  handleInviteClose,
  changeSeriesNameModalOpen,
  setChangeSeriesNameModalOpen,
  tournamentsBySeriesData,
  handleDeleteTournamentFromSeries,
}: SeriesModalProps) {
  const [filterValue, setFilterValue] = useState('')
  const [page, setPage] = useState(1)
  const rowsPerPage = 5

  const filteredTournaments = useMemo(() => {
    if (!filterValue) return tournamentData.tournamentsByUser

    return tournamentData.tournamentsByUser.filter((tournament: Tournament) =>
      tournament.name.toLowerCase().includes(filterValue.toLowerCase()),
    )
  }, [filterValue, tournamentData])

  const pages = Math.ceil(filteredTournaments.length / rowsPerPage)

  const displayedTournaments = useMemo(() => {
    const start = (page - 1) * rowsPerPage
    const end = start + rowsPerPage

    return filteredTournaments.slice(start, end)
  }, [page, filteredTournaments])

  const onSearchChange = useCallback((value: string) => {
    setFilterValue(value)
    setPage(1)
  }, [])

  const topContent = (
    <div className="flex justify-between">
      <Input placeholder="Search by name..." value={filterValue} onValueChange={onSearchChange} />
    </div>
  )

  const bottomContent = (
    <div className="flex justify-between">
      <Pagination showControls page={page} total={pages} onChange={setPage} />
    </div>
  )

  return (
    <Modal className="z-[51]" size="2xl" isOpen={inviteModalOpen} onClose={onClose}>
      <ModalContent>
        <ModalHeader>
          {selectedSeries?.name}
          <button className="ml-4" onClick={() => setChangeSeriesNameModalOpen(true)}>
            <EditIcon size={20} fill="#979797" />
          </button>
        </ModalHeader>
        <ModalHeader>Add Tournaments</ModalHeader>
        <ModalBody>
          <div>
            <Table aria-label="Series table" topContent={topContent} bottomContent={bottomContent}>
              <TableHeader>
                <TableColumn>Name</TableColumn>
                <TableColumn>Actions</TableColumn>
              </TableHeader>
              <TableBody>
                {displayedTournaments.map((tournament: Tournament) => (
                  <TableRow key={tournament.id}>
                    <TableCell>{tournament.name}</TableCell>
                    <TableCell>
                      <Button
                        color="primary"
                        size="sm"
                        onClick={() => handleAddTournamentToSeries(tournament.id)}
                      >
                        Add To Series
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          <ModalHeader>Tournaments</ModalHeader>
          <UpdateSeriesNameModal
            selectedSeries={selectedSeries}
            onUpdate={handleInviteClose}
            isOpen={changeSeriesNameModalOpen}
            onClose={() => setChangeSeriesNameModalOpen(false)}
          />

          {tournamentsBySeriesData && tournamentsBySeriesData.tournamentsBySeries && (
            <Table aria-label="Tournaments in series table">
              <TableHeader>
                <TableColumn>Name</TableColumn>
                <TableColumn>Actions</TableColumn>
              </TableHeader>
              <TableBody>
                {tournamentsBySeriesData.tournamentsBySeries.map((tournament: any) => (
                  <TableRow key={tournament.id}>
                    <TableCell>{tournament.name}</TableCell>
                    <TableCell>
                      <button onClick={() => handleDeleteTournamentFromSeries(tournament.id)}>
                        <DeleteIcon size={20} fill="hsl(var(--nextui-danger)" />
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
  )
}
