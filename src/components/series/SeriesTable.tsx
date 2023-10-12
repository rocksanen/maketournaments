import React from 'react'
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell } from '@nextui-org/react'
import { EditIcon } from '@/components/icons/table/edit-icon'
import { DeleteIcon } from '@/components/icons/table/delete-icon'
import { Series } from '@/types/Series'
interface SeriesTableProps {
  seriesByUser: any
  // eslint-disable-next-line no-unused-vars
  handleInviteClick: (series: Series) => void
  // eslint-disable-next-line no-unused-vars
  handleDeleteSeries: (id: string) => void
}
export default function SeriesTable({
  seriesByUser,
  handleInviteClick,
  handleDeleteSeries,
}: SeriesTableProps) {
  return (
    <div className="w-full flex flex-col gap-4">
      <Table aria-label="Series table">
        <TableHeader>
          <TableColumn>Name</TableColumn>
          <TableColumn>No. Tournaments</TableColumn>
          <TableColumn>Actions</TableColumn>
        </TableHeader>
        <TableBody emptyContent="You haven't created any series yet.">
          {seriesByUser.map((series: Series) => (
            <TableRow key={series.id}>
              <TableCell>{series.name}</TableCell>
              <TableCell>{series.tournaments ? series.tournaments.length : 0}</TableCell>
              <TableCell>
                <button onClick={() => handleInviteClick(series)}>
                  <EditIcon size={20} fill="#979797" />
                </button>
                <button
                  className="ml-4"
                  onClick={() => {
                    if (window.confirm(`Are you sure you want to delete series: ${series.name}?`))
                      handleDeleteSeries(series.id)
                  }}
                >
                  <DeleteIcon size={20} fill="hsl(var(--nextui-danger)" />
                </button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
