import { User, Tooltip, Chip } from '@nextui-org/react'
import React from 'react'
import { DeleteIcon } from '../icons/table/delete-icon'
import { EditIcon } from '../icons/table/edit-icon'
import { EyeIcon } from '../icons/table/eye-icon'
import { tournaments } from './data'
import Link from 'next/link'

interface Props {
  tournament: (typeof tournaments)[number]
  columnKey: string | React.Key
}

export const RenderCell = ({ tournament, columnKey }: Props) => {
  // @ts-ignore
  const cellValue = tournament[columnKey]
  switch (columnKey) {
    case 'name':
      return <div>{cellValue}</div>
    case 'date':
      return (
        <div>
          <span>{cellValue}</span>
        </div>
      )
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

    case 'actions':
      return (
        <div className="flex items-center gap-4 ">
          <div>
            <Tooltip content="Details">
              <button onClick={() => console.log('View user', tournament.id)}>
                <EyeIcon size={20} fill="#979797" />
              </button>
            </Tooltip>
          </div>
          <div>
            <Tooltip content="Edit tournament" color="secondary">
              <Link
                href={{
                  pathname: '/tourneys/editTournament',
                  query: { id: tournament.id },
                }}
                as={`/edit/${tournament.id}`}
              >
                <button>
                  <EditIcon size={20} fill="#979797" />
                </button>
              </Link>
            </Tooltip>
          </div>
          <div></div>
        </div>
      )
    default:
      return cellValue
  }
}
