import {
  Link,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from '@nextui-org/react'
import React from 'react'
import { columns } from './invitationdata'
import { RenderCell } from './render-invitationCell'
import { User } from '@/types/User'

type TableWrapperProps = {
  invitedUsers: User[]
}

export const TableWrapper: React.FC<TableWrapperProps> = ({ invitedUsers }) => {
  return (
    <div className=" w-full flex flex-col gap-4">
      <Table aria-label="Example table with custom cells">
        <TableHeader columns={columns}>
          {(column) => (
            <TableColumn key={column.uid} align={column.uid === 'actions' ? 'center' : 'start'}>
              {column.name}
            </TableColumn>
          )}
        </TableHeader>
        <TableBody items={invitedUsers}>
          {(item) => (
            <TableRow>
              {(columnKey) => (
                <TableCell>
                  {columnKey === 'name' ? item.name : ''}
                  {columnKey === 'email' ? item.email : ''}
                  {columnKey === 'status' ? <RenderCell item={item} columnKey={columnKey} /> : ''}
                </TableCell>
              )}
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  )
}
