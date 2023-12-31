import { Button, Input } from '@nextui-org/react'
import Link from 'next/link'
import React, { useState } from 'react'
import { DotsIcon } from '../icons/accounts/dots-icon'
import { ExportIcon } from '../icons/accounts/export-icon'
import { InfoIcon } from '../icons/accounts/info-icon'
import { TrashIcon } from '../icons/accounts/trash-icon'
import { HouseIcon } from '../icons/breadcrumb/house-icon'
import { SettingsIcon } from '../icons/sidebar/settings-icon'
import { TableWrapper } from '../tournamentTable/table'

export const Accounts = () => {
  const [searchTerm, setSearchTerm] = useState('')

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

      <h3 className="text-xl font-semibold">All tournaments</h3>
      <div className="flex justify-between flex-wrap gap-4 items-center">
        <div className="flex items-center gap-3 flex-wrap md:flex-nowrap">
          <Input
            classNames={{
              input: 'w-full',
              mainWrapper: 'w-full',
            }}
            placeholder="Search tournaments"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
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
      <div className="max-w-[95rem] mx-auto w-full">
        <TableWrapper search={searchTerm} />
      </div>
    </div>
  )
}
