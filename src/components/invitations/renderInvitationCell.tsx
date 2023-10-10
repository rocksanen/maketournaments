import { Tooltip, Chip } from '@nextui-org/react'
import React from 'react'
import { EyeIcon } from '../icons/table/eye-icon'
import { Tournament } from '@/types/Tournament'

interface Props {
  tournament: Tournament
  columnKey: string | React.Key
  adminName: string
  // eslint-disable-next-line no-unused-vars
  setSelectedTournament: (tournament: Tournament | null) => void
}

export const RenderCell = ({ tournament, columnKey, adminName, setSelectedTournament }: Props) => {
  const cellValue = tournament[columnKey as keyof Tournament]
  const currentDate = new Date()
  const tournamentDate = new Date(Number(tournament.date))
  const status = currentDate < tournamentDate ? 'Active' : 'Finished'

  switch (columnKey) {
    case 'name':
      return <div>{cellValue}</div>
    case 'date':
      return (
        <div>
          <span>{tournamentDate.toDateString()}</span>
        </div>
      )
    case 'admin':
      return <div>{adminName}</div>
    case 'status':
      return (
        <Chip size="sm" variant="flat" color={status === 'Active' ? 'success' : 'warning'}>
          <span className="capitalize text-xs">{status}</span>
        </Chip>
      )
    case 'actions':
      return (
        <div className="flex items-center gap-4 ">
          <div>
            <button onClick={() => setSelectedTournament(tournament)}>
              <EyeIcon size={20} fill="#979797" />
            </button>
          </div>
        </div>
      )
    default:
      return <div>{cellValue}</div>
  }
}
