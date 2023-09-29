import { Tooltip, Chip } from '@nextui-org/react'
import React from 'react'
import { EyeIcon } from '../icons/table/eye-icon'
import { EditIcon } from '../icons/table/edit-icon'
import Link from 'next/link'

interface Props {
  tournament: any;
  columnKey: string | React.Key
  userId: string
}

export const RenderCell = ({ tournament, columnKey, userId }: Props) => {
  const cellValue = tournament[columnKey];

  const isAdmin = tournament.admin.some((admin: any) => admin.id === userId);
  const isPlayer = tournament.players.some((player: any) => player.id === userId);

  const role = isAdmin ? 'Admin' : isPlayer ? 'Player' : 'Unknown';

  switch (columnKey) {
    case 'name':
      return <div>{cellValue}</div>;
    case 'date':
      return (
        <div>
          <span>{new Date(cellValue).toLocaleDateString()}</span>
        </div>
      )
    case 'role':
      return <div>{role}</div>;
    case 'actions':
      return (
        <div className="flex items-center gap-4 ">
          <div>
            <Tooltip content="Details">
              <button onClick={() => console.log('View tournament', tournament.id)}>
                <EyeIcon size={20} fill="#979797" />
              </button>
            </Tooltip>
          </div>
          {isAdmin && (
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
          )}
        </div>
      );
    default:
      return <div>{cellValue}</div>;
  }
}
