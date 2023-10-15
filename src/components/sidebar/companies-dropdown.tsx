import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownSection,
  DropdownTrigger,
} from '@nextui-org/react'
import React, { useState } from 'react'
import { AcmeIcon } from '../icons/acme-icon'
import { AcmeLogo } from '../icons/acmelogo'
import { BottomIcon } from '../icons/sidebar/bottom-icon'

interface Company {
  name: string
  location: string
  logo: React.ReactNode
}

export const CompaniesDropdown = () => {
  const [company, setCompany] = useState<Company>({
    name: 'First Era Magic',
    location: 'Helsinki, Finland',
    logo: <AcmeIcon />,
  })
  return (
    <Dropdown
      classNames={{
        base: 'w-full min-w-[260px]',
      }}
    >
      <DropdownTrigger className="cursor-pointer">
        <div className="flex items-center gap-2">
          {company.logo}
          <div className="flex flex-col gap-4">
            <h3 className="text-xl font-medium m-0 text-default-900 -mb-4 whitespace-nowrap">
              {company.name}
            </h3>
            <span className="text-xs font-medium text-default-500">{company.location}</span>
          </div>
          <BottomIcon />
        </div>
      </DropdownTrigger>
      <DropdownMenu
        onAction={(e) => {
          if (e === '1') {
            setCompany({
              name: 'FirstEraMagic',
              location: 'Helsinki',
              logo: <AcmeIcon />,
            })
          }
        }}
        aria-label="Avatar Actions"
      >
        <DropdownSection title="Companies">
          <DropdownItem
            key="1"
            startContent={<AcmeIcon />}
            description="First Era Magic"
            classNames={{
              base: 'py-4',
              title: 'text-base font-semibold',
            }}
          >
            Facebook
          </DropdownItem>
        </DropdownSection>
      </DropdownMenu>
    </Dropdown>
  )
}
