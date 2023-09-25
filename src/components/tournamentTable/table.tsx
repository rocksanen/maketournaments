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
import { columns, tournaments } from './data'
import { RenderCell } from './render-cell'

export const TableWrapper = () => {
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
        <TableBody items={tournaments}>
          {(item) => (
            <TableRow>
              {(columnKey) => (
                <TableCell>{RenderCell({ tournament: item, columnKey: columnKey })}</TableCell>
              )}
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  )
}
