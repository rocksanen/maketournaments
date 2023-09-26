import { Chip } from '@nextui-org/react'
import React from 'react'
import { invited_players } from './data'

interface Props {
  tournament: (typeof invited_players)[number]
  columnKey: string | React.Key
}

export const RenderCell = ({ tournament, columnKey }: Props) => {
  // @ts-ignore
  const cellValue = tournament[columnKey]
  switch (columnKey) {
    case 'name':
      return <div>{cellValue}</div>
    case 'role':
      return (
        <div>
          <div>
            <span>{cellValue}</span>
          </div>
          <div>
            <span>{tournament.team}</span>
          </div>
        </div>
      )
    case 'status':
      return (
        <Chip
          size="sm"
          variant="flat"
          color={cellValue === 'active' ? 'success' : cellValue === 'paused' ? 'danger' : 'warning'}
        >
          <span className="capitalize text-xs">{cellValue}</span>
        </Chip>
      )
    default:
      return cellValue
  }
}
