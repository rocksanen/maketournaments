'use client'
import React, { useState } from 'react'
import {
  Input,
  Checkbox,
  Button,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from '@nextui-org/react'
import { Label } from '@radix-ui/react-dropdown-menu'

function TourneysNew() {
  const [selectedKeys, setSelectedKeys] = React.useState(
    new Set(['Select Ruleset'])
  )
  const [hiddenField, setHiddenField] = useState('hidden')

  const newTourney = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const form = e.currentTarget
    console.log({
      tourneyName: (form[0] as HTMLInputElement).value,
      maxPlayers: (form[3] as HTMLInputElement).value,
      endDate: (form[4] as HTMLInputElement).value,
      invitationOnly: (form[5] as HTMLInputElement).checked,
    })
    if (selectedKeys.has('Custom')) {
      console.log('customModeName: ', (form[2] as HTMLInputElement).value)
    }
    if (!selectedKeys.has('Custom')) {
      const selectedKey = selectedKeys.values().next().value
      console.log(selectedKey)
    }
  }

  const chooseGameMode = React.useMemo(() => {
    console.log(selectedKeys)
    // if selectedkeys has value custom, then make an alert
    if (selectedKeys.has('Custom')) {
      setHiddenField('visible')
    }
    if (!selectedKeys.has('Custom')) {
      setHiddenField('hidden')
    }
    return selectedKeys
  }, [selectedKeys])

  return (
    <div className="bg-amber-800 p-10 rounded-lg">
      <form className="flex flex-col gap-6" onSubmit={newTourney}>
        <h2 className="text-3xl font-bold">Create a new tourney!</h2>
        <Input type="text" label="Tourney Name" placeholder="" />
        <Dropdown>
          <DropdownTrigger>
            <Button className="capitalize">{chooseGameMode}</Button>
          </DropdownTrigger>
          <DropdownMenu
            aria-label="Ruleset"
            variant="flat"
            disallowEmptySelection
            selectionMode="single"
            selectedKeys={selectedKeys}
            onSelectionChange={setSelectedKeys}
          >
            <DropdownItem key="A">Mode A</DropdownItem>
            <DropdownItem key="B">Mode B</DropdownItem>
            <DropdownItem key="C">Mode C</DropdownItem>
            <DropdownItem key="D">Mode D</DropdownItem>
            <DropdownItem key="Custom">Custom Mode</DropdownItem>
          </DropdownMenu>
        </Dropdown>

        <Input
          className={hiddenField}
          type="selection"
          label="Ruleset Name"
          placeholder=""
        />
        <Input
          type="number"
          min="0"
          max="64"
          label="Max Players"
          placeholder=""
        />
        <Input
          type="date"
          min={new Date().toISOString().split('T')[0]}
          label="End Date"
          labelPlacement="outside-left"
          placeholder=""
        />
        <Checkbox>Invitation Only</Checkbox>
        <Button type="submit">Submit</Button>
      </form>
    </div>
  )
}

export default TourneysNew
