import { Chip, Spinner } from '@nextui-org/react'
import React from 'react'

interface RenderCellProps {
  item: any
  columnKey: string
}

export const RenderCell: React.FC<RenderCellProps> = ({ item, columnKey }) => {
  const cellValue = item[columnKey]
  switch (columnKey) {
    case 'name':
      return <div>{cellValue}</div>
    case 'email':
      return (
        <div>
          <div>
            <span>{cellValue}</span>
          </div>
        </div>
      )
    case 'status':
      return (
        <div className="flex items-center gap-2">
          <Chip
            size="sm"
            variant="flat"
            color={
              cellValue === 'joined' ? 'success' : cellValue === 'paused' ? 'danger' : 'warning'
            }
          >
            <span className="capitalize text-xs">{cellValue}</span>
          </Chip>
          {cellValue === 'pending' && <Spinner color="warning" size="sm" />}
        </div>
      )
    default:
      return <div>{cellValue}</div>
  }
}
